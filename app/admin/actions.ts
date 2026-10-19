'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { assertAdmin } from '@/lib/auth/admin';
import { auth } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { blogPosts, categories, subcategories, tools, toolSubmissions } from '@/lib/db/schema';

export type FormState = { error?: string; success?: string } | null;

const slug = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.');
const optionalUrl = z.union([z.literal(''), z.url()]);

const toolSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug,
  website: z.url(),
  summary: z.string().trim().min(20).max(500),
  bestFor: z.string().trim().max(500),
  pricing: z.string().trim().min(2).max(80),
  logoUrl: optionalUrl,
  primaryCategoryId: z.string().trim().min(1),
  status: z.enum(['draft', 'published', 'archived'])
});

const blogSchema = z.object({
  title: z.string().trim().min(4).max(180),
  slug,
  excerpt: z.string().trim().min(20).max(320),
  content: z.string().trim().min(40),
  coverImageUrl: optionalUrl,
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  status: z.enum(['draft', 'published', 'archived'])
});

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '');
}

function lines(formData: FormData, key: string) {
  return text(formData, key).split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
}

function pairedLines(formData: FormData, key: string, left: string, right: string) {
  return lines(formData, key).map((value) => {
    const [first, ...rest] = value.split('|');
    return { [left]: first.trim(), [right]: rest.join('|').trim() };
  }).filter((value) => value[left] && value[right]);
}

function message(error: unknown) {
  if (error instanceof z.ZodError) return error.issues[0]?.message || 'Check the form fields.';
  if (error instanceof Error && error.message.includes('duplicate key')) return 'This slug is already in use.';
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export async function signInAdmin(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.object({ email: z.email(), password: z.string().min(8) }).safeParse({
    email: text(formData, 'email'),
    password: text(formData, 'password')
  });
  if (!parsed.success) return { error: 'Enter a valid email and password.' };

  const { error } = await auth.signIn.email(parsed.data);
  if (error) return { error: error.message || 'Sign in failed.' };
  redirect('/admin/');
}

export async function signOutAdmin() {
  await auth.signOut();
  redirect('/login/admin/');
}

export async function createTool(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await assertAdmin();
    const values = toolSchema.parse({
      name: text(formData, 'name'), slug: text(formData, 'slug'), website: text(formData, 'website'),
      summary: text(formData, 'summary'), bestFor: text(formData, 'bestFor'), pricing: text(formData, 'pricing'),
      logoUrl: text(formData, 'logoUrl'), primaryCategoryId: text(formData, 'primaryCategoryId'), status: text(formData, 'status')
    });
    await getDb().insert(tools).values({
      ...values,
      logoUrl: values.logoUrl || null,
      websiteImageUrl: text(formData, 'websiteImageUrl') || null,
      secondaryCategoryIds: formData.getAll('secondaryCategoryIds').map(String).filter(Boolean),
      subcategoryIds: formData.getAll('subcategoryIds').map(String).filter(Boolean),
      highlights: lines(formData, 'highlights'),
      details: {
        startingPrice: text(formData, 'startingPrice'),
        freeOption: text(formData, 'freeOption'),
        pricingVerified: text(formData, 'pricingVerified'),
        audience: text(formData, 'audience'),
        introduction: text(formData, 'introduction'),
        features: pairedLines(formData, 'features', 'name', 'description'),
        workflow: lines(formData, 'workflow'),
        pricingSummary: text(formData, 'pricingSummary'),
        pros: lines(formData, 'pros'),
        cons: lines(formData, 'cons'),
        useCases: pairedLines(formData, 'useCases', 'name', 'description'),
        editorialSummary: text(formData, 'editorialSummary'),
        faqs: pairedLines(formData, 'faqs', 'question', 'answer')
      },
      socialLinks: [
        ['x', 'X', text(formData, 'xUrl')],
        ['facebook', 'Facebook', text(formData, 'facebookUrl')],
        ['youtube', 'YouTube', text(formData, 'youtubeUrl')],
        ['linkedin', 'LinkedIn', text(formData, 'linkedinUrl')],
        ['email', 'Email', text(formData, 'supportEmail') ? `mailto:${text(formData, 'supportEmail')}` : '']
      ].filter((item) => item[2]).map(([network, label, url]) => ({ network, label: `${values.name} on ${label}`, url })),
      seoTitle: text(formData, 'seoTitle') || null,
      seoDescription: text(formData, 'seoDescription') || null,
      metaKeywords: text(formData, 'metaKeywords') || null,
      verified: formData.get('verified') === 'on',
      affiliate: formData.get('affiliate') === 'on',
      featured: formData.get('featured') === 'on',
      followLink: formData.get('followLink') === 'on',
      submittedByAuthId: admin.id,
      publishedAt: values.status === 'published' ? new Date() : null
    });
    revalidatePath('/admin/tools/');
    return { success: 'Tool saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function createBlog(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await assertAdmin();
    const values = blogSchema.parse({
      title: text(formData, 'title'), slug: text(formData, 'slug'), excerpt: text(formData, 'excerpt'),
      content: text(formData, 'content'), coverImageUrl: text(formData, 'coverImageUrl'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription'), status: text(formData, 'status')
    });
    await getDb().insert(blogPosts).values({
      ...values,
      coverImageUrl: values.coverImageUrl || null,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      authorAuthId: admin.id,
      publishedAt: values.status === 'published' ? new Date() : null
    });
    revalidatePath('/admin/blogs/');
    return { success: 'Blog post saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function createCategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await assertAdmin();
    const values = z.object({
      id: slug,
      slug,
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().min(10).max(300)
    }).parse({ id: text(formData, 'id'), slug: text(formData, 'slug'), name: text(formData, 'name'), description: text(formData, 'description') });
    await getDb().insert(categories).values(values);
    revalidatePath('/admin/categories/');
    return { success: 'Category saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function createSubcategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await assertAdmin();
    const values = z.object({
      parentCategoryId: slug,
      slug,
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().min(10).max(300)
    }).parse({
      parentCategoryId: text(formData, 'parentCategoryId'),
      slug: text(formData, 'slug'),
      name: text(formData, 'name'),
      description: text(formData, 'description')
    });
    await getDb().insert(subcategories).values({
      ...values,
      id: `${values.parentCategoryId}.${values.slug}`
    });
    revalidatePath('/admin/subcategories/');
    return { success: 'Sub category saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setToolStatus(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: z.uuid(), status: z.enum(['draft', 'published', 'archived']) }).parse({
    id: text(formData, 'id'), status: text(formData, 'status')
  });
  await getDb().update(tools).set({
    status: values.status,
    updatedAt: new Date(),
    publishedAt: values.status === 'published' ? new Date() : null
  }).where(eq(tools.id, values.id));
  revalidatePath('/admin/tools/');
}

export async function setBlogStatus(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: z.uuid(), status: z.enum(['draft', 'published', 'archived']) }).parse({
    id: text(formData, 'id'), status: text(formData, 'status')
  });
  await getDb().update(blogPosts).set({
    status: values.status,
    updatedAt: new Date(),
    publishedAt: values.status === 'published' ? new Date() : null
  }).where(eq(blogPosts.id, values.id));
  revalidatePath('/admin/blogs/');
}

export async function reviewSubmission(formData: FormData) {
  const admin = await assertAdmin();
  const values = z.object({ id: z.uuid(), status: z.enum(['in_review', 'approved', 'rejected']) }).parse({
    id: text(formData, 'id'), status: text(formData, 'status')
  });
  const db = getDb();
  await db.update(toolSubmissions).set({
    status: values.status,
    reviewedByAuthId: admin.id,
    reviewedAt: new Date(),
    updatedAt: new Date()
  }).where(eq(toolSubmissions.id, values.id));

  if (values.status === 'approved') {
    const [submission] = await db.select().from(toolSubmissions).where(and(eq(toolSubmissions.id, values.id), eq(toolSubmissions.status, 'approved'))).limit(1);
    if (submission) {
      const generatedSlug = submission.toolName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
      await db.insert(tools).values({
        name: submission.toolName,
        slug: generatedSlug || `tool-${submission.id.slice(0, 8)}`,
        website: submission.website,
        summary: submission.description,
        primaryCategoryId: submission.primaryCategoryId,
        secondaryCategoryIds: submission.secondaryCategoryIds,
        subcategoryIds: submission.subcategoryIds,
        status: 'draft',
        submittedByAuthId: submission.submittedByAuthId
      }).onConflictDoNothing({ target: tools.slug });
    }
  }
  revalidatePath('/admin/submissions/');
  revalidatePath('/admin/tools/');
}

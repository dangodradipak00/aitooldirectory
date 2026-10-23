'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { assertAdmin } from '@/lib/auth/admin';
import { auth } from '@/lib/auth/server';
import { blogMediaKeys, cleanupOldOrphanedBlogMedia, deleteBlogStorageKeys, deleteUnreferencedBlogMedia } from '@/lib/blog-media';
import { getDb } from '@/lib/db';
import { blogPosts, categories, subcategories, tools, toolSubmissions } from '@/lib/db/schema';
import { uploadBlogCover, uploadToolImage } from '@/lib/storage/neon';
import { deleteUnreferencedToolMedia } from '@/lib/tool-media';

export type FormState = { error?: string; success?: string; fieldErrors?: { slug?: string } } | null;

const slug = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.');
const optionalUrl = z.union([z.literal(''), z.url()]);
const duplicateBlogSlugState = { fieldErrors: { slug: 'This slug is already used by another blog. Please choose a different slug.' } } satisfies NonNullable<FormState>;

function isBlogSlugConflict(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error && error.code === '23505') return true;
  return error instanceof Error && /blog_posts_slug_(?:unique|key)/i.test(error.message);
}

const toolSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug,
  website: z.url(),
  summary: z.string().trim().min(20).max(500),
  contentMarkdown: z.string().trim().min(80).max(100000),
  pricing: z.enum(['Free', 'Freemium', 'Paid']),
  primaryCategoryId: z.string().trim().min(1),
  seoTitle: z.string().trim().max(60),
  seoDescription: z.string().trim().max(160),
  status: z.enum(['draft', 'published', 'archived'])
});

const blogSchema = z.object({
  title: z.string().trim().min(4).max(180),
  slug,
  content: z.string().trim().min(40),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
  status: z.enum(['draft', 'published', 'archived'])
});

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '');
}

function message(error: unknown) {
  if (error instanceof z.ZodError) return error.issues[0]?.message || 'Check the form fields.';
  if (error instanceof Error && error.message.includes('duplicate key')) return 'This slug is already in use.';
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function structuredFaqs(formData: FormData) {
  const questions = formData.getAll('faqQuestions').map(String);
  const answers = formData.getAll('faqAnswers').map(String);
  const faqs = Array.from({ length: Math.max(questions.length, answers.length) }, (_, index) => ({
    question: (questions[index] || '').trim(),
    answer: (answers[index] || '').trim()
  })).filter(({ question, answer }) => question || answer);
  if (faqs.some(({ question, answer }) => !question || !answer)) {
    throw new Error('Every FAQ needs both a question and answer.');
  }
  return z.array(z.object({
    question: z.string().min(2).max(160),
    answer: z.string().min(2).max(700)
  })).max(30).parse(faqs);
}

function structuredToolContent(formData: FormData) {
  const item = z.string().trim().min(2).max(500);
  const list = (key: 'pros' | 'cons') => z.array(item).max(20).parse(
    formData.getAll(key).map(String).map((value) => value.trim()).filter(Boolean)
  );
  const useCaseTitles = formData.getAll('useCaseTitles').map(String);
  const useCaseDescriptions = formData.getAll('useCaseDescriptions').map(String);
  const useCases = Array.from({ length: Math.max(useCaseTitles.length, useCaseDescriptions.length) }, (_, index) => ({
    title: (useCaseTitles[index] || '').trim(),
    description: (useCaseDescriptions[index] || '').trim()
  })).filter(({ title, description }) => title || description);
  if (useCases.some(({ title, description }) => !title || !description)) {
    throw new Error('Every use case needs both a title and description.');
  }
  const faqs = structuredFaqs(formData);
  return {
    pros: list('pros'),
    cons: list('cons'),
    features: [],
    useCases: z.array(z.object({ title: z.string().min(2).max(160), description: z.string().min(2).max(700) })).max(20).parse(useCases),
    faqs
  };
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
      summary: text(formData, 'summary'), contentMarkdown: text(formData, 'contentMarkdown'), pricing: text(formData, 'pricing'),
      primaryCategoryId: text(formData, 'primaryCategoryId'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription'), status: text(formData, 'status')
    });
    const logoFile = formData.get('logoFile');
    const websiteImageFile = formData.get('websiteImageFile');
    const structuredContent = structuredToolContent(formData);
    const [logoUrl, websiteImageUrl] = await Promise.all([
      logoFile instanceof File && logoFile.size ? uploadToolImage(logoFile, 'logo') : null,
      websiteImageFile instanceof File && websiteImageFile.size ? uploadToolImage(websiteImageFile, 'website') : null
    ]);
    await getDb().insert(tools).values({
      ...values,
      logoUrl,
      websiteImageUrl,
      ...structuredContent,
      conclusion: null,
      bestFor: '',
      secondaryCategoryIds: formData.getAll('secondaryCategoryIds').map(String).filter(Boolean),
      subcategoryIds: formData.getAll('subcategoryIds').map(String).filter(Boolean),
      highlights: [],
      details: null,
      socialLinks: [
        ['x', 'X', text(formData, 'xUrl')],
        ['facebook', 'Facebook', text(formData, 'facebookUrl')],
        ['youtube', 'YouTube', text(formData, 'youtubeUrl')],
        ['linkedin', 'LinkedIn', text(formData, 'linkedinUrl')],
        ['email', 'Email', text(formData, 'supportEmail') ? `mailto:${text(formData, 'supportEmail')}` : '']
      ].filter((item) => item[2]).map(([network, label, url]) => ({ network, label: `${values.name} on ${label}`, url })),
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      verified: formData.get('verified') === 'on',
      followLink: text(formData, 'followLink') === 'dofollow',
      submittedByAuthId: admin.id,
      publishedAt: values.status === 'published' ? new Date() : null
    });
    revalidatePath('/admin/tools/');
    revalidatePath(`/tools/${values.slug}/`);
    return { success: 'Tool saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function updateTool(toolId: string, _state: FormState, formData: FormData): Promise<FormState> {
  const uploadedMedia: string[] = [];
  try {
    await assertAdmin();
    const id = z.uuid().parse(toolId);
    const db = getDb();
    const [existing] = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
    if (!existing) return { error: 'Tool not found.' };

    const values = toolSchema.parse({
      name: text(formData, 'name'), slug: text(formData, 'slug'), website: text(formData, 'website'),
      summary: text(formData, 'summary'), contentMarkdown: text(formData, 'contentMarkdown'), pricing: text(formData, 'pricing'),
      primaryCategoryId: text(formData, 'primaryCategoryId'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription'), status: text(formData, 'status')
    });
    const logoFile = formData.get('logoFile');
    const websiteImageFile = formData.get('websiteImageFile');
    const structuredContent = structuredToolContent(formData);
    const newLogoUrl = logoFile instanceof File && logoFile.size ? await uploadToolImage(logoFile, 'logo') : null;
    if (newLogoUrl) uploadedMedia.push(newLogoUrl);
    const newWebsiteImageUrl = websiteImageFile instanceof File && websiteImageFile.size ? await uploadToolImage(websiteImageFile, 'website') : null;
    if (newWebsiteImageUrl) uploadedMedia.push(newWebsiteImageUrl);
    const removeLogoImage = formData.get('removeLogoImage') === 'on';
    const removeWebsiteImage = formData.get('removeWebsiteImage') === 'on';
    const nextLogoUrl = newLogoUrl || (removeLogoImage ? null : existing.logoUrl);
    const nextWebsiteImageUrl = newWebsiteImageUrl || (removeWebsiteImage ? null : existing.websiteImageUrl);
    await db.update(tools).set({
      ...values,
      logoUrl: nextLogoUrl,
      websiteImageUrl: nextWebsiteImageUrl,
      ...structuredContent,
      conclusion: null,
      details: null,
      secondaryCategoryIds: formData.getAll('secondaryCategoryIds').map(String).filter(Boolean),
      subcategoryIds: formData.getAll('subcategoryIds').map(String).filter(Boolean),
      socialLinks: [
        ['x', 'X', text(formData, 'xUrl')],
        ['facebook', 'Facebook', text(formData, 'facebookUrl')],
        ['youtube', 'YouTube', text(formData, 'youtubeUrl')],
        ['linkedin', 'LinkedIn', text(formData, 'linkedinUrl')],
        ['email', 'Email', text(formData, 'supportEmail') ? `mailto:${text(formData, 'supportEmail')}` : '']
      ].filter((item) => item[2]).map(([network, label, url]) => ({ network, label: `${values.name} on ${label}`, url })),
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      verified: formData.get('verified') === 'on',
      followLink: text(formData, 'followLink') === 'dofollow',
      publishedAt: values.status === 'published' ? existing.publishedAt || new Date() : null,
      updatedAt: new Date()
    }).where(eq(tools.id, id));
    uploadedMedia.length = 0;
    const failedCleanup = await deleteUnreferencedToolMedia([
      existing.logoUrl !== nextLogoUrl ? existing.logoUrl : null,
      existing.websiteImageUrl !== nextWebsiteImageUrl ? existing.websiteImageUrl : null
    ]);

    revalidatePath('/');
    revalidatePath('/admin/tools/');
    revalidatePath('/admin/submissions/');
    revalidatePath('/categories/');
    revalidatePath('/tool-sitemap.xml');
    revalidatePath(`/tools/${existing.slug}/`);
    revalidatePath(`/tools/${values.slug}/`);
    return { success: failedCleanup.length ? 'Tool updated, but one old image could not be removed from storage.' : 'Tool updated. Removed or replaced images were cleared from storage.' };
  } catch (error) {
    if (uploadedMedia.length) await deleteUnreferencedToolMedia(uploadedMedia);
    return { error: message(error) };
  }
}

export async function updateSubmission(submissionId: string, _state: FormState, formData: FormData): Promise<FormState> {
  const uploadedMedia: string[] = [];
  try {
    await assertAdmin();
    const id = z.uuid().parse(submissionId);
    const db = getDb();
    const [existing] = await db.select().from(toolSubmissions).where(eq(toolSubmissions.id, id)).limit(1);
    if (!existing) return { error: 'User tool submission not found.' };

    const values = toolSchema.omit({ status: true }).parse({
      name: text(formData, 'name'), slug: text(formData, 'slug'), website: text(formData, 'website'),
      summary: text(formData, 'summary'), contentMarkdown: text(formData, 'contentMarkdown'), pricing: text(formData, 'pricing'),
      primaryCategoryId: text(formData, 'primaryCategoryId'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription')
    });
    const logoFile = formData.get('logoFile');
    const websiteImageFile = formData.get('websiteImageFile');
    const structuredContent = structuredToolContent(formData);
    const newLogoUrl = logoFile instanceof File && logoFile.size ? await uploadToolImage(logoFile, 'logo') : null;
    if (newLogoUrl) uploadedMedia.push(newLogoUrl);
    const newWebsiteImageUrl = websiteImageFile instanceof File && websiteImageFile.size ? await uploadToolImage(websiteImageFile, 'website') : null;
    if (newWebsiteImageUrl) uploadedMedia.push(newWebsiteImageUrl);
    const removeLogoImage = formData.get('removeLogoImage') === 'on';
    const removeWebsiteImage = formData.get('removeWebsiteImage') === 'on';
    const logoUrl = newLogoUrl || (removeLogoImage ? null : existing.logoUrl);
    const websiteImageUrl = newWebsiteImageUrl || (removeWebsiteImage ? null : existing.websiteImageUrl);
    const subcategoryIds = formData.getAll('subcategoryIds').map(String).filter(Boolean);
    const socialLinks = [
      ['x', 'X', text(formData, 'xUrl')],
      ['facebook', 'Facebook', text(formData, 'facebookUrl')],
      ['youtube', 'YouTube', text(formData, 'youtubeUrl')],
      ['linkedin', 'LinkedIn', text(formData, 'linkedinUrl')],
      ['email', 'Email', text(formData, 'supportEmail') ? `mailto:${text(formData, 'supportEmail')}` : '']
    ].filter((item) => item[2]).map(([network, label, url]) => ({ network, label: `${values.name} on ${label}`, url }));
    const requestedPublicationStatus = text(formData, 'publicationStatus');
    const publicationStatus = requestedPublicationStatus
      ? z.enum(['draft', 'published', 'archived']).parse(requestedPublicationStatus)
      : null;

    await db.update(toolSubmissions).set({
      toolName: values.name,
      slug: values.slug,
      website: values.website,
      description: values.summary,
      contentMarkdown: values.contentMarkdown,
      pricing: values.pricing,
      logoUrl,
      websiteImageUrl,
      ...structuredContent,
      primaryCategoryId: values.primaryCategoryId,
      secondaryCategoryIds: [],
      subcategoryIds,
      socialLinks,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      updatedAt: new Date()
    }).where(eq(toolSubmissions.id, id));

    // Older versions created a linked draft as soon as Edit was clicked.
    // Keep no public record until approval; approved user tools stay managed here.
    if (existing.promotedToolId && existing.status !== 'approved') {
      await db.delete(tools).where(eq(tools.id, existing.promotedToolId));
    }
    if (existing.promotedToolId && existing.status === 'approved') {
      const [publicTool] = await db.select().from(tools).where(eq(tools.id, existing.promotedToolId)).limit(1);
      if (publicTool) {
        const nextStatus = publicationStatus || publicTool.status;
        await db.update(tools).set({
          name: values.name,
          slug: values.slug,
          website: values.website,
          summary: values.summary,
          contentMarkdown: values.contentMarkdown,
          pricing: values.pricing,
          logoUrl,
          websiteImageUrl,
          ...structuredContent,
          primaryCategoryId: values.primaryCategoryId,
          secondaryCategoryIds: [],
          subcategoryIds,
          socialLinks,
          seoTitle: values.seoTitle || null,
          seoDescription: values.seoDescription || null,
          status: nextStatus,
          publishedAt: nextStatus === 'published' ? publicTool.publishedAt || new Date() : null,
          updatedAt: new Date()
        }).where(eq(tools.id, publicTool.id));
        revalidatePath(`/tools/${publicTool.slug}/`);
        revalidatePath(`/tools/${values.slug}/`);
        revalidatePath('/');
        revalidatePath('/categories/');
        revalidatePath('/tool-sitemap.xml');
      }
    }

    uploadedMedia.length = 0;
    const failedCleanup = await deleteUnreferencedToolMedia([
      existing.logoUrl !== logoUrl ? existing.logoUrl : null,
      existing.websiteImageUrl !== websiteImageUrl ? existing.websiteImageUrl : null
    ]);

    revalidatePath('/admin/');
    revalidatePath('/admin/tools/');
    revalidatePath('/admin/submissions/');
    revalidatePath(`/admin/submissions/${id}/edit/`);
    return { success: failedCleanup.length ? 'User Tool updated, but one old image could not be removed from storage.' : 'User Tool updated. It remains in User Tools.' };
  } catch (error) {
    if (uploadedMedia.length) await deleteUnreferencedToolMedia(uploadedMedia);
    return { error: message(error) };
  }
}

function submissionSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

async function ensureSubmissionTool(submissionId: string) {
  const db = getDb();
  const [submission] = await db.select().from(toolSubmissions).where(eq(toolSubmissions.id, submissionId)).limit(1);
  if (!submission) throw new Error('User tool submission not found.');
  if (submission.promotedToolId) {
    const [existing] = await db.select().from(tools).where(eq(tools.id, submission.promotedToolId)).limit(1);
    if (existing) return existing;
  }

  const baseSlug = submissionSlug(submission.toolName) || `tool-${submission.id.slice(0, 8)}`;
  const [slugMatch] = await db.select({ id: tools.id }).from(tools).where(eq(tools.slug, baseSlug)).limit(1);
  const uniqueSlug = slugMatch ? `${baseSlug.slice(0, 82)}-${submission.id.slice(0, 7)}` : baseSlug;
  const [created] = await db.insert(tools).values({
    name: submission.toolName,
    slug: uniqueSlug,
    website: submission.website,
    summary: submission.description,
    pricing: submission.pricing,
    logoUrl: submission.logoUrl,
    websiteImageUrl: submission.websiteImageUrl,
    contentMarkdown: submission.contentMarkdown,
    pros: submission.pros,
    cons: submission.cons,
    useCases: submission.useCases,
    faqs: submission.faqs,
    socialLinks: submission.socialLinks,
    seoTitle: submission.seoTitle,
    seoDescription: submission.seoDescription,
    primaryCategoryId: submission.primaryCategoryId,
    secondaryCategoryIds: submission.secondaryCategoryIds,
    subcategoryIds: submission.subcategoryIds,
    status: 'draft',
    submittedByAuthId: submission.submittedByAuthId
  }).returning();
  await db.update(toolSubmissions).set({
    promotedToolId: created.id,
    status: submission.status === 'pending' ? 'in_review' : submission.status,
    updatedAt: new Date()
  }).where(eq(toolSubmissions.id, submission.id));
  return created;
}

function revalidateBlogPages(...slugs: string[]) {
  revalidatePath('/admin/');
  revalidatePath('/admin/blogs/');
  revalidatePath('/blog/');
  revalidatePath('/blog/[slug]', 'page');
  for (const value of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${value}/`);
  revalidatePath('/blog-sitemap.xml');
  revalidatePath('/sitemap.xml');
}

export async function createBlog(_state: FormState, formData: FormData): Promise<FormState> {
  let createdSlug = '';
  let uploadedCoverKey = '';
  try {
    const admin = await assertAdmin();
    const values = blogSchema.parse({
      title: text(formData, 'title'), slug: text(formData, 'slug'),
      content: text(formData, 'content'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription'), status: text(formData, 'status')
    });
    const db = getDb();
    const [duplicate] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, values.slug)).limit(1);
    if (duplicate) return duplicateBlogSlugState;
    const coverImageFile = formData.get('coverImageFile');
    const coverImageUrl = coverImageFile instanceof File && coverImageFile.size ? await uploadBlogCover(coverImageFile) : null;
    uploadedCoverKey = [...blogMediaKeys(coverImageUrl)][0] || '';
    const faqs = structuredFaqs(formData);
    await db.insert(blogPosts).values({
      ...values,
      faqs,
      coverImageUrl,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      authorAuthId: admin.id,
      publishedAt: values.status === 'published' ? new Date() : null
    });
    createdSlug = values.slug;
    uploadedCoverKey = '';
    await cleanupOldOrphanedBlogMedia();
    revalidateBlogPages(values.slug);
  } catch (error) {
    if (uploadedCoverKey) await deleteBlogStorageKeys([uploadedCoverKey]);
    if (isBlogSlugConflict(error)) return duplicateBlogSlugState;
    return { error: message(error) };
  }
  redirect(`/admin/blogs/${createdSlug}/edit/`);
}

export async function updateBlog(blogId: string, _state: FormState, formData: FormData): Promise<FormState> {
  let uploadedCoverKey = '';
  let redirectSlug = '';
  let result: FormState = null;
  try {
    await assertAdmin();
    const id = z.uuid().parse(blogId);
    const db = getDb();
    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!existing) return { error: 'Blog post not found.' };

    const values = blogSchema.parse({
      title: text(formData, 'title'), slug: text(formData, 'slug'),
      content: text(formData, 'content'), seoTitle: text(formData, 'seoTitle'),
      seoDescription: text(formData, 'seoDescription'), status: text(formData, 'status')
    });
    const [duplicate] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, values.slug)).limit(1);
    if (duplicate && duplicate.id !== id) return duplicateBlogSlugState;
    const coverImageFile = formData.get('coverImageFile');
    const newCoverImageUrl = coverImageFile instanceof File && coverImageFile.size ? await uploadBlogCover(coverImageFile) : null;
    uploadedCoverKey = [...blogMediaKeys(newCoverImageUrl)][0] || '';
    const removeCoverImage = formData.get('removeCoverImage') === 'on';
    const faqs = structuredFaqs(formData);

    const nextCoverImageUrl = removeCoverImage ? null : newCoverImageUrl || existing.coverImageUrl;
    const previousMedia = blogMediaKeys(existing.content, existing.coverImageUrl);
    const nextMedia = blogMediaKeys(values.content, nextCoverImageUrl);
    const cleanupCandidates = [...previousMedia].filter((key) => !nextMedia.has(key));
    if (uploadedCoverKey && !nextMedia.has(uploadedCoverKey)) cleanupCandidates.push(uploadedCoverKey);

    await db.update(blogPosts).set({
      ...values,
      faqs,
      coverImageUrl: nextCoverImageUrl,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      publishedAt: values.status === 'published' ? existing.publishedAt || new Date() : null,
      updatedAt: new Date()
    }).where(eq(blogPosts.id, id));
    uploadedCoverKey = '';
    const failedCleanup = await deleteUnreferencedBlogMedia(cleanupCandidates);
    await cleanupOldOrphanedBlogMedia();
    revalidateBlogPages(existing.slug, values.slug);
    redirectSlug = existing.slug === values.slug ? '' : values.slug;
    result = {
      success: failedCleanup.length
        ? 'Blog updated. One or more unused images could not be removed; check the server log.'
        : 'Blog updated. Removed images were also cleared from Neon Object Storage.'
    };
  } catch (error) {
    if (uploadedCoverKey) await deleteBlogStorageKeys([uploadedCoverKey]);
    if (isBlogSlugConflict(error)) return duplicateBlogSlugState;
    return { error: message(error) };
  }
  if (redirectSlug) redirect(`/admin/blogs/${redirectSlug}/edit/`);
  return result;
}

function revalidateTaxonomyPages() {
  revalidatePath('/');
  revalidatePath('/categories/');
  revalidatePath('/categories/[slug]', 'page');
  revalidatePath('/category-sitemap.xml');
  revalidatePath('/submit/');
}

export async function createCategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await assertAdmin();
    const values = z.object({
      id: slug.optional(),
      slug,
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().min(10).max(300)
    }).parse({ id: text(formData, 'id') || undefined, slug: text(formData, 'slug'), name: text(formData, 'name'), description: text(formData, 'description') });
    await getDb().insert(categories).values({ ...values, id: values.id || values.slug });
    revalidatePath('/admin/categories/');
    revalidateTaxonomyPages();
    return { success: 'Category saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function updateCategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await assertAdmin();
    const values = z.object({
      id: slug,
      slug,
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().min(10).max(300)
    }).parse({ id: text(formData, 'id'), slug: text(formData, 'slug'), name: text(formData, 'name'), description: text(formData, 'description') });
    await getDb().update(categories).set({
      name: values.name,
      slug: values.slug,
      description: values.description,
      updatedAt: new Date()
    }).where(eq(categories.id, values.id));
    revalidatePath('/admin/categories/');
    revalidatePath('/admin/subcategories/');
    revalidateTaxonomyPages();
    return { success: 'Category updated.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setCategoryVisibility(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: slug, publicVisible: z.enum(['true', 'false']) }).parse({
    id: text(formData, 'id'), publicVisible: text(formData, 'publicVisible')
  });
  await getDb().update(categories).set({
    publicVisible: values.publicVisible === 'true',
    updatedAt: new Date()
  }).where(eq(categories.id, values.id));
  revalidatePath('/admin/categories/');
  revalidatePath('/admin/subcategories/');
  revalidateTaxonomyPages();
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
    revalidateTaxonomyPages();
    return { success: 'Sub category saved.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function updateSubcategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await assertAdmin();
    const values = z.object({
      id: z.string().trim().min(3).max(205),
      parentCategoryId: slug,
      slug,
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().min(10).max(300)
    }).parse({
      id: text(formData, 'id'),
      parentCategoryId: text(formData, 'parentCategoryId'),
      slug: text(formData, 'slug'),
      name: text(formData, 'name'),
      description: text(formData, 'description')
    });
    await getDb().update(subcategories).set({
      parentCategoryId: values.parentCategoryId,
      slug: values.slug,
      name: values.name,
      description: values.description,
      updatedAt: new Date()
    }).where(eq(subcategories.id, values.id));
    revalidatePath('/admin/subcategories/');
    revalidateTaxonomyPages();
    return { success: 'Sub category updated.' };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setSubcategoryVisibility(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: z.string().trim().min(3).max(205), publicVisible: z.enum(['true', 'false']) }).parse({
    id: text(formData, 'id'), publicVisible: text(formData, 'publicVisible')
  });
  await getDb().update(subcategories).set({
    publicVisible: values.publicVisible === 'true',
    updatedAt: new Date()
  }).where(eq(subcategories.id, values.id));
  revalidatePath('/admin/subcategories/');
  revalidateTaxonomyPages();
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

export async function deleteTool(formData: FormData) {
  await assertAdmin();
  const id = z.uuid().parse(text(formData, 'id'));
  const db = getDb();
  const [tool] = await db.select({ slug: tools.slug }).from(tools).where(eq(tools.id, id)).limit(1);
  if (!tool) return;

  await db.delete(tools).where(eq(tools.id, id));
  revalidatePath('/admin/');
  revalidatePath('/admin/tools/');
  revalidatePath('/admin/submissions/');
  revalidatePath('/');
  revalidatePath('/categories/');
  revalidatePath(`/tools/${tool.slug}/`);
  revalidatePath('/tool-sitemap.xml');
}

export async function setBlogStatus(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: z.uuid(), status: z.enum(['draft', 'published', 'archived']) }).parse({
    id: text(formData, 'id'), status: text(formData, 'status')
  });
  const db = getDb();
  const [post] = await db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, values.id)).limit(1);
  if (!post) return;
  await db.update(blogPosts).set({
    status: values.status,
    updatedAt: new Date(),
    publishedAt: values.status === 'published' ? post.publishedAt || new Date() : null
  }).where(eq(blogPosts.id, values.id));
  revalidateBlogPages(post.slug);
}

export async function deleteBlog(formData: FormData) {
  await assertAdmin();
  const id = z.uuid().parse(text(formData, 'id'));
  const db = getDb();
  const [post] = await db.select({
    slug: blogPosts.slug,
    content: blogPosts.content,
    coverImageUrl: blogPosts.coverImageUrl
  }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) return;
  const removedMedia = blogMediaKeys(post.content, post.coverImageUrl);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  await deleteUnreferencedBlogMedia(removedMedia);
  await cleanupOldOrphanedBlogMedia();
  revalidateBlogPages(post.slug);
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
    await ensureSubmissionTool(values.id);
  } else {
    const [submission] = await db.select({ promotedToolId: toolSubmissions.promotedToolId }).from(toolSubmissions).where(eq(toolSubmissions.id, values.id)).limit(1);
    if (submission?.promotedToolId) {
      await db.update(tools).set({ status: 'draft', publishedAt: null, updatedAt: new Date() }).where(eq(tools.id, submission.promotedToolId));
    }
  }
  revalidatePath('/admin/submissions/');
  revalidatePath('/admin/tools/');
}

export async function setSubmissionPaymentStatus(formData: FormData) {
  await assertAdmin();
  const values = z.object({ id: z.uuid(), paymentStatus: z.enum(['paid', 'unpaid']) }).parse({
    id: text(formData, 'id'), paymentStatus: text(formData, 'paymentStatus')
  });
  await getDb().update(toolSubmissions).set({
    paymentStatus: values.paymentStatus,
    paymentProvider: values.paymentStatus === 'paid' ? 'manual' : null,
    paymentReference: values.paymentStatus === 'paid' ? 'manual-payment' : null,
    updatedAt: new Date()
  }).where(eq(toolSubmissions.id, values.id));
  revalidatePath('/admin/submissions/');
}

export async function deleteSubmission(formData: FormData) {
  await assertAdmin();
  const id = z.uuid().parse(text(formData, 'id'));
  await getDb().delete(toolSubmissions).where(eq(toolSubmissions.id, id));
  revalidatePath('/admin/submissions/');
  revalidatePath('/admin/');
}

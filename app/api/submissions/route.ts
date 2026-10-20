import { z } from 'zod';
import { auth } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { toolSubmissions } from '@/lib/db/schema';
import { uploadToolImage } from '@/lib/storage/neon';

const optionalUrl = z.union([z.literal(''), z.url().max(500)]);
const submissionSchema = z.object({
  toolName: z.string().trim().min(2).max(120),
  website: z.url().max(500),
  description: z.string().trim().min(20).max(1500),
  contentMarkdown: z.string().trim().min(80).max(100000),
  pricing: z.enum(['Free', 'Freemium', 'Paid']),
  submitterName: z.string().trim().min(2).max(120),
  submitterEmail: z.email().max(200),
  primaryCategoryId: z.string().trim().max(100).nullable(),
  subcategoryIds: z.array(z.string().max(160)).max(12),
  categorySuggestion: z.string().trim().max(500).optional(),
  pros: z.array(z.string().trim().min(2).max(500)).max(20),
  cons: z.array(z.string().trim().min(2).max(500)).max(20),
  useCases: z.array(z.object({ title: z.string().trim().min(2).max(160), description: z.string().trim().min(2).max(700) })).max(20),
  faqs: z.array(z.object({ question: z.string().trim().min(2).max(160), answer: z.string().trim().min(2).max(700) })).max(30),
  seoTitle: z.string().trim().max(60),
  seoDescription: z.string().trim().max(160),
  xUrl: optionalUrl,
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  supportEmail: z.union([z.literal(''), z.email().max(200)]),
  websiteField: z.string().max(0).optional()
});

const value = (formData: FormData, key: string) => String(formData.get(key) || '');
const values = (formData: FormData, key: string) => formData.getAll(key).map(String).map((item) => item.trim()).filter(Boolean);

function pairs(formData: FormData, firstKey: string, secondKey: string, first: string, second: string) {
  const left = formData.getAll(firstKey).map(String);
  const right = formData.getAll(secondKey).map(String);
  return Array.from({ length: Math.max(left.length, right.length) }, (_, index) => ({
    [first]: (left[index] || '').trim(),
    [second]: (right[index] || '').trim()
  })).filter((item) => item[first] || item[second]);
}

const submissionSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const categorizeForMe = value(formData, 'categorizeForMe') === 'true';
    const input = submissionSchema.parse({
      toolName: value(formData, 'toolName'),
      website: value(formData, 'website'),
      description: value(formData, 'description'),
      contentMarkdown: value(formData, 'contentMarkdown'),
      pricing: value(formData, 'pricing'),
      submitterName: value(formData, 'submitterName'),
      submitterEmail: value(formData, 'submitterEmail'),
      primaryCategoryId: categorizeForMe ? null : value(formData, 'primaryCategoryId') || null,
      subcategoryIds: categorizeForMe ? [] : values(formData, 'subcategoryIds'),
      categorySuggestion: value(formData, 'categorySuggestion'),
      pros: values(formData, 'pros'),
      cons: values(formData, 'cons'),
      useCases: pairs(formData, 'useCaseTitles', 'useCaseDescriptions', 'title', 'description'),
      faqs: pairs(formData, 'faqQuestions', 'faqAnswers', 'question', 'answer'),
      seoTitle: value(formData, 'seoTitle'),
      seoDescription: value(formData, 'seoDescription'),
      xUrl: value(formData, 'xUrl'),
      facebookUrl: value(formData, 'facebookUrl'),
      youtubeUrl: value(formData, 'youtubeUrl'),
      linkedinUrl: value(formData, 'linkedinUrl'),
      supportEmail: value(formData, 'supportEmail'),
      websiteField: value(formData, 'websiteField')
    });
    if (input.websiteField) return Response.json({ ok: true }, { status: 201 });

    const { data } = await auth.getSession();
    const logoFile = formData.get('logoFile');
    const websiteImageFile = formData.get('websiteImageFile');
    const [logoUrl, websiteImageUrl] = await Promise.all([
      logoFile instanceof File && logoFile.size ? uploadToolImage(logoFile, 'logo') : null,
      websiteImageFile instanceof File && websiteImageFile.size ? uploadToolImage(websiteImageFile, 'website') : null
    ]);
    const socialLinks = [
      ['x', 'X', input.xUrl],
      ['facebook', 'Facebook', input.facebookUrl],
      ['youtube', 'YouTube', input.youtubeUrl],
      ['linkedin', 'LinkedIn', input.linkedinUrl],
      ['email', 'Email', input.supportEmail ? `mailto:${input.supportEmail}` : '']
    ].filter((item) => item[2]).map(([network, label, url]) => ({ network, label: `${input.toolName} on ${label}`, url }));

    await getDb().insert(toolSubmissions).values({
      toolName: input.toolName,
      website: input.website,
      description: input.description,
      slug: submissionSlug(input.toolName),
      logoUrl,
      websiteImageUrl,
      contentMarkdown: input.contentMarkdown,
      pricing: input.pricing,
      pros: input.pros,
      cons: input.cons,
      useCases: input.useCases,
      faqs: input.faqs,
      socialLinks,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      primaryCategoryId: input.primaryCategoryId,
      secondaryCategoryIds: [],
      subcategoryIds: input.subcategoryIds,
      categorySuggestion: input.categorySuggestion || null,
      submittedByAuthId: data?.user?.id || null
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || 'Check your submission.' }, { status: 400 });
    console.error('Tool submission failed', error);
    return Response.json({ error: error instanceof Error ? error.message : 'We could not save the submission. Please try again.' }, { status: 500 });
  }
}

import { z } from 'zod';
import { auth } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { toolSubmissions } from '@/lib/db/schema';

const submissionSchema = z.object({
  toolName: z.string().trim().min(2).max(120),
  website: z.url().max(500),
  description: z.string().trim().min(20).max(1500),
  submitterName: z.string().trim().min(2).max(120),
  submitterEmail: z.email().max(200),
  primaryCategoryId: z.string().trim().max(100).nullable(),
  secondaryCategoryIds: z.array(z.string().max(100)).max(2),
  subcategoryIds: z.array(z.string().max(160)).max(12),
  categorySuggestion: z.string().trim().max(500).optional(),
  websiteField: z.string().max(0).optional()
});

export async function POST(request: Request) {
  try {
    const input = submissionSchema.parse(await request.json());
    if (input.websiteField) return Response.json({ ok: true }, { status: 201 });
    const { data } = await auth.getSession();
    await getDb().insert(toolSubmissions).values({
      toolName: input.toolName,
      website: input.website,
      description: input.description,
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      primaryCategoryId: input.primaryCategoryId,
      secondaryCategoryIds: input.secondaryCategoryIds,
      subcategoryIds: input.subcategoryIds,
      categorySuggestion: input.categorySuggestion || null,
      submittedByAuthId: data?.user?.id || null
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || 'Check your submission.' }, { status: 400 });
    console.error('Tool submission failed', error);
    return Response.json({ error: 'We could not save the submission. Please try again.' }, { status: 500 });
  }
}

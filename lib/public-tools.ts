import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { getTool as getStaticTool, getToolsByCategory as getStaticToolsByCategory } from '@/data/tools';
import { getDb } from '@/lib/db';
import { tools } from '@/lib/db/schema';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function publicTool(tool: typeof tools.$inferSelect) {
  return {
    ...tool,
    initials: initials(tool.name),
    published: true,
    secondaryCategoryIds: tool.secondaryCategoryIds || [],
    subcategoryIds: tool.subcategoryIds || [],
    highlights: tool.highlights || [],
    pros: tool.pros || [],
    cons: tool.cons || [],
    features: tool.features || [],
    conclusion: tool.conclusion || null,
    useCases: tool.useCases || [],
    faqs: tool.faqs || [],
    socialLinks: tool.socialLinks || [],
    details: tool.details || null
  };
}

export const getPublicTool = cache(async (slug: string) => {
  try {
    const [tool] = await getDb().select().from(tools).where(eq(tools.slug, slug)).limit(1);
    if (tool) {
      if (tool.status !== 'published') return null;
      return publicTool(tool);
    }
  } catch {
    // Static seed data keeps the public directory available if the database is temporarily unreachable.
  }
  return getStaticTool(slug) || null;
});

export async function getPublicRelatedTools(currentSlug: string, primaryCategoryId: string) {
  try {
    const rows = await getDb().select().from(tools).where(eq(tools.status, 'published'));
    return rows
      .filter((tool) => tool.slug !== currentSlug && tool.primaryCategoryId === primaryCategoryId)
      .map(publicTool);
  } catch {
    return getStaticToolsByCategory(primaryCategoryId)
      .filter((tool) => tool.slug !== currentSlug);
  }
}

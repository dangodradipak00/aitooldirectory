import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { categories, subcategories, tools } from '../lib/db/schema.ts';
// The public directory remains the source for the initial one-time import.
import { mainCategories, subcategories as existingSubcategories } from '../data/categories.js';
import { tools as existingTools } from '../data/tools.js';

config({ path: '.env.local' });

async function seed() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing from .env.local.');
  const db = drizzle(neon(process.env.DATABASE_URL));
  for (const category of mainCategories) {
    const values = {
      id: category.id,
      slug: category.slug || category.id,
      name: category.name,
      description: category.description || '',
      publicVisible: category.publicVisible !== false,
      selectedOnHomepage: Boolean(category.selectedOnHomepage),
      updatedAt: new Date()
    };
    await db.insert(categories).values(values).onConflictDoUpdate({ target: categories.id, set: values });
  }

  for (const subcategory of existingSubcategories) {
    const values = {
      id: subcategory.id,
      slug: subcategory.slug,
      name: subcategory.name,
      description: subcategory.description || '',
      parentCategoryId: subcategory.parentCategoryId,
      publicVisible: true,
      updatedAt: new Date()
    };
    await db.insert(subcategories).values(values).onConflictDoUpdate({ target: subcategories.id, set: values });
  }

  for (const tool of existingTools) {
    const values = {
      slug: tool.slug,
      name: tool.name,
      website: tool.website,
      summary: tool.summary,
      bestFor: tool.bestFor || '',
      pricing: tool.pricing || 'Contact vendor',
      primaryCategoryId: tool.primaryCategoryId || null,
      secondaryCategoryIds: tool.secondaryCategoryIds || [],
      subcategoryIds: tool.subcategoryIds || [],
      highlights: tool.highlights || [],
      details: tool.details || null,
      socialLinks: tool.socialLinks || [],
      status: tool.published ? 'published' as const : 'draft' as const,
      publishedAt: tool.published ? new Date() : null,
      updatedAt: new Date()
    };
    const [existing] = await db.select({ id: tools.id }).from(tools).where(eq(tools.slug, tool.slug)).limit(1);
    if (existing) await db.update(tools).set(values).where(eq(tools.id, existing.id));
    else await db.insert(tools).values(values);
  }
  console.log(`Seeded ${mainCategories.length} categories, ${existingSubcategories.length} subcategories and ${existingTools.length} tools.`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

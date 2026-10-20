import TaxonomyManager from '../TaxonomyManager';
import { getDb } from '@/lib/db';
import { categories, tools } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const db = getDb();
  const [rows, toolRows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select({ primaryCategoryId: tools.primaryCategoryId, secondaryCategoryIds: tools.secondaryCategoryIds }).from(tools)
  ]);
  const toolCounts = new Map<string, number>();
  for (const tool of toolRows) {
    const ids = new Set([tool.primaryCategoryId, ...tool.secondaryCategoryIds].filter((id): id is string => Boolean(id)));
    for (const id of ids) toolCounts.set(id, (toolCounts.get(id) || 0) + 1);
  }
  return <TaxonomyManager mode="category" rows={rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    toolCount: toolCounts.get(row.id) || 0
  }))} />;
}

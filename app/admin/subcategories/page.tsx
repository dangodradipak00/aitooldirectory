import TaxonomyManager from '../TaxonomyManager';
import { getDb } from '@/lib/db';
import { categories, subcategories, tools } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminSubcategoriesPage() {
  const db = getDb();
  const [rows, categoryRows, toolRows] = await Promise.all([
    db.select().from(subcategories).orderBy(subcategories.name),
    db.select().from(categories).orderBy(categories.name),
    db.select({ subcategoryIds: tools.subcategoryIds }).from(tools)
  ]);
  const categoryNames = new Map(categoryRows.map((category) => [category.id, category.name]));
  const toolCounts = new Map<string, number>();
  for (const tool of toolRows) for (const id of new Set(tool.subcategoryIds)) toolCounts.set(id, (toolCounts.get(id) || 0) + 1);

  return <TaxonomyManager
    categories={categoryRows.map(({ id, name, publicVisible }) => ({ id, name, publicVisible }))}
    mode="subcategory"
    rows={rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      parentCategoryName: categoryNames.get(row.parentCategoryId) || row.parentCategoryId,
      toolCount: toolCounts.get(row.id) || 0
    }))}
  />;
}

import { getDb } from '@/lib/db';
import { categories, subcategories } from '@/lib/db/schema';
import { createTool } from '../../actions';
import ToolEditor from '../ToolEditor';

export default async function AddNewAiToolPage() {
  const db = getDb();
  const [categoryRows, subcategoryRows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select().from(subcategories).orderBy(subcategories.name)
  ]);

  return <ToolEditor
    action={createTool}
    categories={categoryRows.map(({ id, name }) => ({ id, name }))}
    subcategories={subcategoryRows.map(({ id, name, parentCategoryId }) => ({ id, name, parentCategoryId }))}
    heading="Add New AI Tool"
    submitLabel="Save AI Tool"
  />;
}

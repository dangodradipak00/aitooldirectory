import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { categories, subcategories, tools } from '@/lib/db/schema';
import { updateTool } from '../../../actions';
import ToolEditor from '../../ToolEditor';

export default async function EditToolPage({ params }: PageProps<'/admin/tools/[id]/edit'>) {
  const { id } = await params;
  const db = getDb();
  const [[tool], categoryRows, subcategoryRows] = await Promise.all([
    db.select().from(tools).where(eq(tools.id, id)).limit(1),
    db.select().from(categories).orderBy(categories.name),
    db.select().from(subcategories).orderBy(subcategories.name)
  ]);
  if (!tool) notFound();

  return <ToolEditor
    action={updateTool.bind(null, tool.id)}
    categories={categoryRows.map(({ id: categoryId, name }) => ({ id: categoryId, name }))}
    subcategories={subcategoryRows.map(({ id: subcategoryId, name, parentCategoryId }) => ({ id: subcategoryId, name, parentCategoryId }))}
    tool={tool}
    heading={`Edit ${tool.name}`}
    submitLabel="Update AI Tool"
  />;
}

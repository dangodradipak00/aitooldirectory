import AdminForm from '../AdminForm';
import { createSubcategory } from '../actions';
import { getDb } from '@/lib/db';
import { categories, subcategories, tools } from '@/lib/db/schema';
import styles from '../admin.module.css';

export default async function AdminSubcategoriesPage() {
  const db = getDb();
  const [rows, categoryRows, toolRows] = await Promise.all([
    db.select().from(subcategories).orderBy(subcategories.name),
    db.select().from(categories).orderBy(categories.name),
    db.select({ subcategoryIds: tools.subcategoryIds }).from(tools)
  ]);
  const categoryNames = new Map(categoryRows.map((category) => [category.id, category.name]));
  const toolCounts = new Map<string, number>();
  for (const tool of toolRows) {
    for (const id of tool.subcategoryIds) toolCounts.set(id, (toolCounts.get(id) || 0) + 1);
  }

  return (
    <>
      <header className={styles.pageHeader}><div><p>Tool category</p><h1>Sub categories</h1><span>Organize every tool into focused workflows under its main category.</span></div></header>
      <section className={styles.splitLayout}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.kicker}>New taxonomy item</p><h2>Add sub category</h2></div></div>
          <AdminForm action={createSubcategory} submitLabel="Save sub category">
            <label>Parent category<select name="parentCategoryId" required><option value="">Choose category</option>{categoryRows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <div className={styles.fieldRow}><label>Name<input name="name" required /></label><label>Slug<input name="slug" placeholder="keyword-research" required /></label></div>
            <label>Description<textarea name="description" rows={4} minLength={10} required /></label>
          </AdminForm>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.kicker}>{rows.length} sub categories</p><h2>Sub category library</h2></div></div>
          <div className={styles.taxonomyTable}>
            <div className={styles.taxonomyHead}><span>Name</span><span>Category</span><span>Tools</span><span>Status</span></div>
            {rows.length ? rows.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{item.slug}</small></div><span>{categoryNames.get(item.parentCategoryId) || item.parentCategoryId}</span><span>{toolCounts.get(item.id) || 0}</span><span className={`${styles.status} ${styles.published}`}>Active</span></article>) : <div className={styles.emptyState}><strong>No sub categories yet.</strong><p>Run the seed or add the first sub category.</p></div>}
          </div>
        </div>
      </section>
    </>
  );
}

import AdminForm from '../AdminForm';
import { createCategory } from '../actions';
import { getDb } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import styles from '../admin.module.css';

export default async function AdminCategoriesPage() {
  const rows = await getDb().select().from(categories).orderBy(categories.name);
  return (
    <>
      <header className={styles.pageHeader}><div><p>Tool category</p><h1>Categories</h1><span>Keep every tool organized under a stable, reusable structure.</span></div></header>
      <section className={styles.splitLayout}>
        <div className={styles.panel}><div className={styles.panelTitle}><div><p className={styles.kicker}>New taxonomy item</p><h2>Add category</h2></div></div><AdminForm action={createCategory} submitLabel="Save category"><label>Name<input name="name" required /></label><div className={styles.fieldRow}><label>Stable ID<input name="id" placeholder="seo-marketing" required /></label><label>Public slug<input name="slug" placeholder="seo-marketing" required /></label></div><label>Description<textarea name="description" rows={4} minLength={10} required /></label></AdminForm></div>
        <div className={styles.panel}><div className={styles.panelTitle}><div><p className={styles.kicker}>{rows.length} categories</p><h2>Current taxonomy</h2></div></div><div className={styles.categoryList}>{rows.length ? rows.map((category) => <article key={category.id}><span>{category.name.slice(0, 1)}</span><div><strong>{category.name}</strong><small>{category.id}</small><p>{category.description}</p></div></article>) : <div className={styles.emptyState}><strong>No database categories yet.</strong><p>The seed step will bring in the current website taxonomy.</p></div>}</div></div>
      </section>
    </>
  );
}

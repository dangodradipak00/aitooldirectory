'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import type { FormState } from './actions';
import {
  createCategory,
  createSubcategory,
  setCategoryVisibility,
  setSubcategoryVisibility,
  updateCategory,
  updateSubcategory
} from './actions';
import styles from './admin.module.css';

type TaxonomyRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  publicVisible: boolean;
  createdAt: string;
  updatedAt: string;
  toolCount: number;
  parentCategoryId?: string;
  parentCategoryName?: string;
};

type CategoryOption = { id: string; name: string; publicVisible: boolean };
type EditorAction = (state: FormState, formData: FormData) => Promise<FormState>;

function TaxonomyEditor({ action, categories, mode, onClose, row }: {
  action: EditorAction;
  categories: CategoryOption[];
  mode: 'category' | 'subcategory';
  onClose: () => void;
  row: TaxonomyRow | null;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  useEffect(() => {
    if (state?.success) {
      const timeout = window.setTimeout(onClose, 650);
      return () => window.clearTimeout(timeout);
    }
  }, [state?.success, onClose]);

  const label = mode === 'category' ? 'category' : 'sub category';
  return <div className={styles.taxonomyModalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section aria-labelledby="taxonomy-editor-title" aria-modal="true" className={styles.taxonomyModal} role="dialog">
      <header><div><p>{row ? 'Edit taxonomy item' : 'New taxonomy item'}</p><h2 id="taxonomy-editor-title">{row ? `Edit ${label}` : `Add ${label}`}</h2></div><button aria-label="Close" onClick={onClose} type="button">x</button></header>
      <form action={formAction} className={styles.taxonomyForm}>
        {row && <input name="id" type="hidden" value={row.id} />}
        {mode === 'subcategory' && <label>Parent category<select defaultValue={row?.parentCategoryId || ''} name="parentCategoryId" required><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.publicVisible ? '' : ' (Deactive)'}</option>)}</select></label>}
        <label>Name<input defaultValue={row?.name || ''} name="name" placeholder={mode === 'category' ? 'e.g. Image' : 'e.g. AI Image Generator'} required /></label>
        <label>Public slug<input defaultValue={row?.slug || ''} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="lowercase-with-hyphens" required /></label>
        {!row && mode === 'category' && <input name="id" type="hidden" value="" />}
        <label>Description<textarea defaultValue={row?.description || ''} minLength={10} name="description" placeholder="Describe what belongs in this category." required rows={4} /></label>
        {state?.error && <p className={styles.formError} role="alert">{state.error}</p>}
        {state?.success && <p className={styles.formSuccess} role="status">{state.success}</p>}
        <footer><button className={styles.secondaryAction} onClick={onClose} type="button">Cancel</button><button className={styles.primaryButton} disabled={pending} type="submit">{pending ? 'Saving...' : row ? 'Save changes' : `Add ${label}`}</button></footer>
      </form>
    </section>
  </div>;
}

export default function TaxonomyManager({ categories = [], mode, rows }: {
  categories?: CategoryOption[];
  mode: 'category' | 'subcategory';
  rows: TaxonomyRow[];
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [parent, setParent] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<{ open: boolean; row: TaxonomyRow | null }>({ open: false, row: null });
  const isSubcategory = mode === 'subcategory';
  const filtered = useMemo(() => rows.filter((row) => {
    const haystack = `${row.name} ${row.slug} ${row.parentCategoryName || ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (status === 'all' || (status === 'active') === row.publicVisible)
      && (!isSubcategory || parent === 'all' || row.parentCategoryId === parent);
  }), [isSubcategory, parent, query, rows, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const date = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  const editorAction = editor.row
    ? (isSubcategory ? updateSubcategory : updateCategory)
    : (isSubcategory ? createSubcategory : createCategory);
  const closeEditor = () => setEditor({ open: false, row: null });
  const resetPage = () => setPage(1);

  return <>
    <section className={styles.dataPanel}>
      <div className={styles.dataTitle}><div><h1>Tool {isSubcategory ? 'Subcategory' : 'Category'}</h1><p>Manage names, visibility and taxonomy details.</p></div><label>Show <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); resetPage(); }}><option>10</option><option>25</option><option>50</option></select> entries</label></div>
      <div className={`${styles.tableFilters} ${styles.taxonomyFilters}`}>
        <label className={styles.searchField}><span aria-hidden="true">Q</span><input aria-label={`Search ${mode}`} value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder={`Search ${isSubcategory ? 'Subcategory' : 'Category'}...`} /></label>
        {isSubcategory && <select aria-label="Filter by parent category" value={parent} onChange={(event) => { setParent(event.target.value); resetPage(); }}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>}
        <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); resetPage(); }}><option value="all">All statuses</option><option value="active">Active</option><option value="deactive">Deactive</option></select>
        <button className={styles.addTaxonomyButton} onClick={() => setEditor({ open: true, row: null })} type="button">+ Add {isSubcategory ? 'Subcategory' : 'Category'}</button>
      </div>
      <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>Name</th>{isSubcategory && <th>Category Name</th>}<th>Tool Count</th><th>Created Date</th><th>Updated Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.slug}</small></td>{isSubcategory && <td>{row.parentCategoryName || row.parentCategoryId}</td>}<td>{row.toolCount}</td><td>{date(row.createdAt)}</td><td>{date(row.updatedAt)}</td><td><span className={row.publicVisible ? styles.liveText : styles.offlineText}>{row.publicVisible ? 'ACTIVE' : 'DEACTIVE'}</span></td><td><details className={styles.actionMenu}><summary aria-label={`Actions for ${row.name}`}>...</summary><div><button onClick={() => setEditor({ open: true, row })} type="button">Edit {isSubcategory ? 'subcategory' : 'category'}</button><form action={isSubcategory ? setSubcategoryVisibility : setCategoryVisibility}><input name="id" type="hidden" value={row.id} /><button name="publicVisible" value={row.publicVisible ? 'false' : 'true'}>{row.publicVisible ? 'Deactivate' : 'Activate'}</button></form></div></details></td></tr>)}</tbody></table></div>
      {!visible.length && <div className={styles.emptyState}><strong>No {isSubcategory ? 'subcategories' : 'categories'} match this filter.</strong></div>}
      <footer className={styles.tableFooter}><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries</span><div><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><strong>{currentPage}</strong><span>of {pages}</span><button aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>Next</button></div></footer>
    </section>
    {editor.open && <TaxonomyEditor action={editorAction} categories={categories} key={`${mode}-${editor.row?.id || 'new'}`} mode={mode} onClose={closeEditor} row={editor.row} />}
  </>;
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { deleteBlog, setBlogStatus } from '../actions';
import styles from '../admin.module.css';

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BlogTable({ rows }: { rows: BlogRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target as Node;
      document.querySelectorAll<HTMLDetailsElement>(`details.${styles.actionMenu}[open]`).forEach((menu) => {
        if (!menu.contains(target)) menu.removeAttribute('open');
      });
    };
    document.addEventListener('pointerdown', closeMenus);
    return () => document.removeEventListener('pointerdown', closeMenus);
  }, []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => (!needle || `${row.title} ${row.slug}`.toLowerCase().includes(needle)) && (status === 'all' || row.status === status));
  }, [query, rows, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';

  return <section className={`${styles.dataPanel} ${styles.blogStudioPanel}`}>
    <div className={`${styles.dataTitle} ${styles.blogDataTitle}`}>
      <div><h1>Blogs</h1><p>{rows.length} total articles · {rows.filter((row) => row.status === 'published').length} published</p></div>
      <div className={styles.blogTitleActions}><label>Show <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>10</option><option>25</option><option>50</option></select> entries</label><Link className={styles.addContentButton} href="/admin/blogs/new/">+ Add new blog</Link></div>
    </div>
    <div className={styles.tableFilters}><label className={styles.searchField}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search title or slug..." /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
    <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>No.</th><th>Article</th><th>Slug</th><th>Status</th><th>Published</th><th>Updated</th><th>Action</th></tr></thead><tbody>{visible.map((post, index) => <tr key={post.id}>
      <td><strong>{(currentPage - 1) * pageSize + index + 1}</strong></td>
      <td><strong><Link href={`/admin/blogs/${post.slug}/edit/`}>{post.title}</Link></strong></td>
      <td><small>/{post.slug}/</small></td>
      <td><span className={`${styles.status} ${styles[post.status]}`}>{post.status}</span></td>
      <td>{formatDate(post.publishedAt)}</td><td>{formatDate(post.updatedAt)}</td>
      <td><div className={styles.blogRowActions}>
        {post.status === 'published' ? <Link className={styles.blogLiveButton} href={`/blog/${post.slug}/`} target="_blank" aria-label={`View ${post.title} on the live website`}>View <span aria-hidden="true">↗</span></Link> : null}
        <details className={styles.actionMenu} onToggle={(event) => {
          if (!event.currentTarget.open) return;
          document.querySelectorAll<HTMLDetailsElement>(`details.${styles.actionMenu}[open]`).forEach((menu) => {
            if (menu !== event.currentTarget) menu.removeAttribute('open');
          });
          router.prefetch(`/admin/blogs/${post.slug}/edit/`);
        }}><summary aria-label={`Actions for ${post.title}`}>•••</summary><div>
        <Link href={`/admin/blogs/${post.slug}/edit/`} onMouseEnter={() => router.prefetch(`/admin/blogs/${post.slug}/edit/`)}>Edit article</Link>
        {post.status === 'published' ? <Link href={`/blog/${post.slug}/`} target="_blank">View live article</Link> : null}
        <form action={setBlogStatus}><input name="id" type="hidden" value={post.id} /><button name="status" value="published">Publish</button><button name="status" value="draft">Move to draft</button><button name="status" value="archived">Archive</button></form>
        <form action={deleteBlog} onSubmit={(event) => { if (!window.confirm(`Permanently delete “${post.title}”? This also removes it from the public blog.`)) event.preventDefault(); }}><input name="id" type="hidden" value={post.id} /><button className={styles.deleteAction} type="submit">Delete article</button></form>
      </div></details></div></td>
    </tr>)}</tbody></table></div>
    {!visible.length ? <div className={styles.emptyState}><strong>No blog posts match this filter.</strong><p>Create a new article or change the current filters.</p></div> : null}
    <footer className={styles.tableFooter}><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries</span><div><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><strong>{currentPage}</strong><span>of {pages}</span><button type="button" disabled={currentPage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>›</button></div></footer>
  </section>;
}

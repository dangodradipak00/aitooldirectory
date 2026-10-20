'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { deleteTool, setToolStatus } from '../actions';
import styles from '../admin.module.css';

type ToolRow = { id: string; name: string; website: string; logoUrl: string | null; status: 'draft' | 'published' | 'archived'; createdAt: string; updatedAt: string };

export default function AdminToolsTable({ rows }: { rows: ToolRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()) && (status === 'all' || row.status === status)), [rows, query, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const date = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));

  return <section className={styles.dataPanel}>
    <div className={styles.dataTitle}><h1>Admin Tools</h1><label>Show <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>10</option><option>25</option><option>50</option></select> entries</label></div>
    <div className={styles.tableFilters}><label className={styles.searchField}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search Tools..." /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="published">Live</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
    <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>Logo</th><th>Tool Name</th><th>Live or Offline</th><th>Created Date</th><th>Updated Date</th><th>Action</th></tr></thead><tbody>{visible.map((tool) => <tr key={tool.id}><td><span className={styles.tableLogo}>{tool.logoUrl ? <img src={tool.logoUrl} alt="" /> : tool.name.slice(0,2).toUpperCase()}</span></td><td><a href={tool.website} target="_blank" rel="noreferrer">{tool.name}</a></td><td><span className={tool.status === 'published' ? styles.liveText : styles.offlineText}>{tool.status === 'published' ? 'LIVE' : 'OFFLINE'}</span></td><td>{date(tool.createdAt)}</td><td>{date(tool.updatedAt)}</td><td><details className={styles.actionMenu} onToggle={(event) => { if (event.currentTarget.open) router.prefetch(`/admin/tools/${tool.id}/edit/`); }}><summary aria-label={`Actions for ${tool.name}`}>•••</summary><div><Link href={`/admin/tools/${tool.id}/edit/`} onMouseEnter={() => router.prefetch(`/admin/tools/${tool.id}/edit/`)} onFocus={() => router.prefetch(`/admin/tools/${tool.id}/edit/`)}>Edit full details</Link><form action={setToolStatus}><input name="id" type="hidden" value={tool.id}/><button name="status" value="published">Set live</button><button name="status" value="draft">Move to draft</button><button name="status" value="archived">Archive</button></form><form action={deleteTool} onSubmit={(event) => { if (!window.confirm(`Permanently delete “${tool.name}” from Admin Tools and the public website?`)) event.preventDefault(); }}><input name="id" type="hidden" value={tool.id}/><button className={styles.deleteAction} type="submit">Delete tool</button></form></div></details></td></tr>)}</tbody></table></div>
    {!visible.length && <div className={styles.emptyState}><strong>No tools match this filter.</strong></div>}
    <footer className={styles.tableFooter}><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries</span><div><button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><strong>{currentPage}</strong><span>of {pages}</span><button disabled={currentPage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>›</button></div></footer>
  </section>;
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { deleteSubmission, reviewSubmission, setSubmissionPaymentStatus } from '../actions';
import styles from '../admin.module.css';

type SubmissionRow = {
  id: string;
  toolName: string;
  logoUrl: string | null;
  website: string;
  submitterName: string;
  submitterEmail: string;
  paymentStatus: string;
  paymentProvider: string | null;
  promotedToolId: string | null;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export default function UserToolsTable({ rows }: { rows: SubmissionRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => rows.filter((row) => `${row.toolName} ${row.submitterName} ${row.submitterEmail}`.toLowerCase().includes(query.toLowerCase()) && (status === 'all' || row.status === status)), [rows, query, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const date = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));

  return <section className={styles.dataPanel}>
    <div className={styles.dataTitle}><div><h1>User Tools</h1><p>Review new requests, contact submitters and record manual payments.</p></div><label>Show <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>10</option><option>25</option><option>50</option></select> entries</label></div>
    <div className={styles.tableFilters}><label className={styles.searchField}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search User Tools..." /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="pending">Pending</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
    <div className={styles.tableScroll}>
      <table className={styles.dataTable}>
        <thead><tr><th>Logo</th><th>Tool Name</th><th>Submitted By</th><th>Payment</th><th>Status</th><th>Created Date</th><th>Updated Date</th><th>Action</th></tr></thead>
        <tbody>{visible.map((item) => {
          const paid = item.paymentStatus === 'paid';
          return <tr key={item.id}>
            <td><span className={styles.tableLogo}>{item.logoUrl ? <img src={item.logoUrl} alt="" /> : item.toolName.slice(0, 2).toUpperCase()}</span></td>
            <td><a href={item.website} target="_blank" rel="noreferrer">{item.toolName}</a></td>
            <td><strong>{item.submitterName}</strong><small><a href={`mailto:${item.submitterEmail}`}>{item.submitterEmail}</a></small></td>
            <td><span className={paid ? styles.paidText : styles.unpaidText}>{paid ? 'PAID' : 'PAYMENT PENDING'}</span><small>{paid ? item.paymentProvider || 'Manual' : 'Contact by email'}</small></td>
            <td><span className={`${styles.status} ${styles[item.status]}`}>{item.status.replace('_', ' ')}</span></td>
            <td>{date(item.createdAt)}</td><td>{date(item.updatedAt)}</td>
            <td><details className={styles.actionMenu} onToggle={(event) => { if (event.currentTarget.open) router.prefetch(`/admin/submissions/${item.id}/edit/`); }}><summary aria-label={`Actions for ${item.toolName}`}>•••</summary><div>
              <Link href={`/admin/submissions/${item.id}/edit/`} onMouseEnter={() => router.prefetch(`/admin/submissions/${item.id}/edit/`)} onFocus={() => router.prefetch(`/admin/submissions/${item.id}/edit/`)}>Edit full details</Link>
              <a href={`mailto:${item.submitterEmail}?subject=${encodeURIComponent(`FreemiumAITools submission: ${item.toolName}`)}`}>Email submitter</a>
              <form action={setSubmissionPaymentStatus}><input name="id" type="hidden" value={item.id} /><button name="paymentStatus" value={paid ? 'unpaid' : 'paid'}>{paid ? 'Mark payment pending' : 'Mark payment received'}</button></form>
              <form action={reviewSubmission}><input name="id" type="hidden" value={item.id} /><button name="status" value="in_review">Mark in review</button>{paid && <button name="status" value="approved">Verify &amp; approve</button>}<button name="status" value="rejected">Reject</button></form>
              <form action={deleteSubmission} onSubmit={(event) => { if (!window.confirm(`Permanently delete the submission for “${item.toolName}”?`)) event.preventDefault(); }}><input name="id" type="hidden" value={item.id} /><button className={styles.deleteAction} type="submit">Delete entry</button></form>
            </div></details></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    {!visible.length && <div className={styles.emptyState}><strong>No user tool requests yet.</strong><p>New tool submissions will appear here immediately.</p></div>}
    <footer className={styles.tableFooter}><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries</span><div><button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><strong>{currentPage}</strong><span>of {pages}</span><button disabled={currentPage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>›</button></div></footer>
  </section>;
}

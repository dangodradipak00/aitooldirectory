'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ToolCard from './ToolCard';
import { SearchIcon } from './Icons';
import styles from './CategoryDirectory.module.css';
import ui from '../styles/ui.module.css';

const PAGE_SIZE = 6;

export default function CategoryDirectory({ tools, subcategories }) {
  const [query, setQuery] = useState('');
  const [subcategory, setSubcategory] = useState('all');
  const [pricing, setPricing] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tools
      .filter((tool) => subcategory === 'all' || tool.subcategoryIds.includes(subcategory))
      .filter((tool) => pricing === 'all' || tool.pricing === pricing)
      .filter((tool) => !normalized || `${tool.name} ${tool.summary} ${tool.bestFor}`.toLowerCase().includes(normalized))
      .sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : sort === 'za' ? b.name.localeCompare(a.name) : 0);
  }, [tools, query, subcategory, pricing, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const change = (setter) => (event) => { setter(event.target.value); setPage(1); };
  const clear = () => { setQuery(''); setSubcategory('all'); setPricing('all'); setSort('featured'); setPage(1); };

  return (
    <div>
      <div className={styles.filters} role="search" aria-label="Filter category tools">
        <label className={styles.search}><span className={ui.srOnly}>Search tools in this category</span><SearchIcon /><input type="search" value={query} onChange={change(setQuery)} placeholder="Search tools…" /></label>
        <label><span className={ui.srOnly}>Subcategory</span><select value={subcategory} onChange={change(setSubcategory)}><option value="all">All subcategories</option>{subcategories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label><span className={ui.srOnly}>Pricing</span><select value={pricing} onChange={change(setPricing)}><option value="all">All pricing</option><option value="Free option">Free option</option><option value="Paid">Paid</option></select></label>
        <label><span className={ui.srOnly}>Sort</span><select value={sort} onChange={change(setSort)}><option value="featured">Featured</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option></select></label>
      </div>
      <div className={styles.results}><p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}</p><button type="button" onClick={clear}>Clear filters</button></div>
      {visible.length ? <div className={styles.grid}>{visible.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div> : <div className={styles.empty}><h3>No matching tools</h3><p>Try another subcategory or clear the filters.</p><Link className={ui.primaryButton} href="/submit/">Add your tool</Link></div>}
      {pageCount > 1 && <nav className={styles.pagination} aria-label="Tool results pages"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></nav>}
    </div>
  );
}

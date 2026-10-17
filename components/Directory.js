'use client';

import { useEffect, useMemo, useState } from 'react';
import ToolCard from './ToolCard';
import { SearchIcon } from './Icons';
import { isToolInCategory } from '../data/tools';
import styles from './Directory.module.css';
import ui from '../styles/ui.module.css';

const SAVED_KEY = 'agency-tool-guide-saved';

export default function Directory({ tools, categories }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState('all');
  const [sort, setSort] = useState('az');
  const [saved, setSaved] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
      setSaved(stored.filter((slug) => tools.some((tool) => tool.slug === slug)));
    } catch {
      setSaved([]);
    }
    const showSaved = () => setSavedOnly(true);
    window.addEventListener('show-saved-tools', showSaved);
    return () => window.removeEventListener('show-saved-tools', showSaved);
  }, [tools]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools
      .filter((tool) => category === 'all' || isToolInCategory(tool, category))
      .filter((tool) => pricing === 'all' || tool.pricing === pricing)
      .filter((tool) => !savedOnly || saved.includes(tool.slug))
      .filter((tool) => !normalizedQuery || `${tool.name} ${tool.summary} ${tool.bestFor}`.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [tools, query, category, pricing, sort, saved, savedOnly]);

  const toggleSaved = (slug) => {
    const next = saved.includes(slug) ? saved.filter((item) => item !== slug) : [...saved, slug];
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('saved-tools-updated'));
  };

  const reset = () => {
    setQuery('');
    setCategory('all');
    setPricing('all');
    setSort('az');
    setSavedOnly(false);
  };

  return (
    <section className={styles.directorySection} id="directory" aria-labelledby="directory-title">
      <div className={ui.shell}>
        <div className={`${ui.sectionHeading} ${styles.directoryHeading}`}>
          <span className={ui.eyebrow}>Software directory</span>
          <h2 id="directory-title">Find the right tool for the job</h2>
          <p>Search by workflow, narrow the list and review the fit before visiting the vendor.</p>
        </div>

        <div className={styles.filterPanel} id="all-tools" role="search" aria-label="Filter software directory">
          <label className={styles.searchField}>
            <span className={ui.srOnly}>Search tools</span>
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search tools or workflows…" />
          </label>
          <label>
            <span className={ui.srOnly}>Category</span>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setSavedOnly(false); }}>
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span className={ui.srOnly}>Pricing</span>
            <select value={pricing} onChange={(event) => setPricing(event.target.value)}>
              <option value="all">All pricing</option>
              <option value="Free option">Free option</option>
              <option value="Paid">Paid</option>
            </select>
          </label>
          <label>
            <span className={ui.srOnly}>Sort tools</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
            </select>
          </label>
        </div>

        <div className={styles.resultsBar}>
          <p aria-live="polite">{savedOnly ? `${results.length} saved` : `${results.length} ${results.length === 1 ? 'tool' : 'tools'}`}</p>
          <div>
            {savedOnly && <button type="button" className={styles.textButton} onClick={() => setSavedOnly(false)}>Show all tools</button>}
            <button type="button" className={styles.textButton} onClick={reset}>Reset filters</button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className={styles.toolGrid}>
            {results.map((tool) => <ToolCard key={tool.slug} tool={tool} saved={saved.includes(tool.slug)} onSave={toggleSaved} />)}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>{savedOnly ? 'No saved tools yet' : 'No matching tools'}</h3>
            <p>{savedOnly ? 'Use the bookmark button on any card to save it in this browser.' : 'Try a broader search or reset the filters.'}</p>
            <button type="button" className={ui.primaryButton} onClick={reset}>Show all tools</button>
          </div>
        )}
      </div>
    </section>
  );
}

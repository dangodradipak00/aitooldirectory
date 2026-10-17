'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ToolCard from './ToolCard';
import { SearchIcon } from './Icons';
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
      .filter((tool) => category === 'all' || tool.category === category)
      .filter((tool) => pricing === 'all' || tool.pricing === pricing)
      .filter((tool) => !savedOnly || saved.includes(tool.slug))
      .filter((tool) => {
        if (!normalizedQuery) return true;
        return `${tool.name} ${tool.summary} ${tool.bestFor}`.toLowerCase().includes(normalizedQuery);
      })
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

  const pickTools = (slugs) => slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter(Boolean);

  const collections = [
    {
      title: 'Latest tools',
      icon: '✦',
      accent: 'pink',
      items: tools.slice(0, 4),
      href: '#all-tools',
      cta: 'See all tools'
    },
    {
      title: 'Client reporting',
      icon: '▣',
      accent: 'blue',
      items: pickTools(['agencyanalytics', 'dashthis', 'looker-studio']),
      href: '/categories/client-reporting/',
      cta: 'View reporting tools'
    },
    {
      title: 'SEO audits',
      icon: '△',
      accent: 'violet',
      items: pickTools(['screaming-frog', 'ahrefs', 'se-ranking']),
      href: '/categories/seo-audits-rank-tracking/',
      cta: 'View SEO tools'
    },
    {
      title: 'Rank tracking',
      icon: '↗',
      accent: 'orange',
      items: pickTools(['se-ranking', 'ahrefs', 'screaming-frog']),
      href: '/categories/seo-audits-rank-tracking/',
      cta: 'Explore rank trackers'
    },
    {
      title: 'Call attribution',
      icon: '⌕',
      accent: 'green',
      items: pickTools(['callrail', 'whatconverts', 'calltrackingmetrics']),
      href: '/categories/call-tracking-attribution/',
      cta: 'View call tracking'
    },
    {
      title: 'Dashboard tools',
      icon: '▦',
      accent: 'cyan',
      items: pickTools(['looker-studio', 'agencyanalytics', 'dashthis']),
      href: '/categories/client-reporting/',
      cta: 'Explore dashboards'
    },
    {
      title: 'Lead tracking',
      icon: '◎',
      accent: 'red',
      items: pickTools(['whatconverts', 'callrail', 'calltrackingmetrics']),
      href: '/categories/call-tracking-attribution/',
      cta: 'Explore lead tools'
    },
    {
      title: 'Agency shortlist',
      icon: '★',
      accent: 'navy',
      items: pickTools(['agencyanalytics', 'ahrefs', 'callrail', 'looker-studio']),
      href: '#all-tools',
      cta: 'Compare the full list'
    }
  ];

  return (
    <section className={styles.directorySection} id="directory" aria-labelledby="directory-title">
      <div className={ui.shell}>
        <div className={`${ui.sectionHeading} ${styles.directoryHeading}`}>
          <span className={ui.eyebrow}>Software directory</span>
          <h2 id="directory-title">Find the right tool for the job</h2>
          <p>Search by workflow, narrow the list and review the fit before visiting the vendor.</p>
        </div>

        <div className={styles.collectionDivider} aria-hidden="true">
          <span>Popular agency collections</span>
        </div>

        <div className={styles.collectionGrid}>
          {collections.map((collection) => (
            <article className={`${styles.collectionCard} ${styles[`accent${collection.accent[0].toUpperCase()}${collection.accent.slice(1)}`]}`} key={collection.title}>
              <header className={styles.collectionHeader}>
                <span className={styles.collectionIcon} aria-hidden="true">{collection.icon}</span>
                <h3>{collection.title}</h3>
              </header>
              <ol className={styles.collectionList}>
                {collection.items.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/tools/${tool.slug}/`}>
                      <span className={styles.collectionLogo} aria-hidden="true">{tool.initials}</span>
                      <span>{tool.name}</span>
                      <span className={styles.rowArrow} aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <Link className={styles.collectionFooter} href={collection.href}>
                {collection.cta} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.collectionActions}>
          <a className={ui.primaryButton} href="#all-tools">See the full software list <span aria-hidden="true">→</span></a>
          <a className={styles.moreCategories} href="#categories">More categories <span aria-hidden="true">→</span></a>
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
              {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
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

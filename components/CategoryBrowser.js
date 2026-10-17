'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowIcon, SearchIcon } from './Icons';
import styles from './CategoryBrowser.module.css';
import ui from '../styles/ui.module.css';

export default function CategoryBrowser({ categories }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.map((category) => {
      if (category.searchText.includes(normalized) && `${category.name} ${category.description} ${category.searchSynonyms.join(' ')}`.toLowerCase().includes(normalized)) {
        return category;
      }
      const matchingSubcategories = category.subcategories.filter((subcategory) => subcategory.searchText.includes(normalized));
      return matchingSubcategories.length ? { ...category, subcategories: matchingSubcategories } : null;
    }).filter(Boolean);
  }, [categories, query]);

  const visibleSubcategoryCount = results.reduce((total, category) => total + category.subcategories.length, 0);

  return (
    <section className={styles.section} aria-labelledby="all-categories-title">
      <div className={ui.shell}>
        <label className={styles.search}>
          <span className={ui.srOnly}>Search categories and subcategories</span>
          <SearchIcon />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories or subcategories…" />
        </label>
        <div className={styles.results} aria-live="polite">{results.length} main categories · {visibleSubcategoryCount} subcategories</div>

        {results.length ? <div className={styles.categoryList}>
          {results.map((category) => (
            <section className={styles.categoryGroup} key={category.id} aria-labelledby={`${category.id}-title`}>
              <header className={styles.categoryHeading}>
                <div><span className={styles.categoryNumber}>{String(category.order).padStart(2, '0')}</span><h2 id={`${category.id}-title`}>{category.name}</h2></div>
              </header>
              <div className={styles.subcategoryGrid}>
                {category.subcategories.map((subcategory) => (
                  <Link className={styles.subcategoryCard} href={`/categories/${category.slug}/#category-tools`} key={subcategory.id}>
                    <h3>{subcategory.name}</h3>
                    <div><span>{subcategory.count} {subcategory.count === 1 ? 'tool' : 'tools'}</span><ArrowIcon /></div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div> : (
          <div className={styles.empty}><h2>No matching categories</h2><p>Try a broader workflow or category name.</p><button type="button" onClick={() => setQuery('')}>Clear search</button></div>
        )}
      </div>
    </section>
  );
}

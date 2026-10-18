'use client';

import { useMemo, useState } from 'react';
import { validateToolClassification } from '../lib/category-utils';
import styles from './ToolSubmissionForm.module.css';
import ui from '../styles/ui.module.css';

export default function ToolSubmissionForm({ categories }) {
  const [search, setSearch] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [secondaryCategoryIds, setSecondaryCategoryIds] = useState([]);
  const [subcategoryIds, setSubcategoryIds] = useState([]);
  const [notSure, setNotSure] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const categoryMap = useMemo(() => new Map(categories.map((item) => [item.id, item])), [categories]);
  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return categories.filter((item) => !normalized || item.searchText.includes(normalized));
  }, [categories, search]);
  const selectedCategories = [primaryCategoryId, ...secondaryCategoryIds].filter(Boolean).map((id) => categoryMap.get(id)).filter(Boolean);
  const validation = notSure ? { valid: true, errors: [] } : validateToolClassification({ primaryCategoryId, secondaryCategoryIds, subcategoryIds });

  const keepSelectedSubcategories = (categoryIds) => setSubcategoryIds((current) => current.filter((id) => categoryIds.includes(id.split('.')[0])));
  const choosePrimary = (id) => {
    const nextSecondary = secondaryCategoryIds.filter((item) => item !== id);
    setPrimaryCategoryId(id);
    setSecondaryCategoryIds(nextSecondary);
    keepSelectedSubcategories([id, ...nextSecondary]);
    setNotSure(false);
  };
  const toggleSecondary = (id) => {
    const next = secondaryCategoryIds.includes(id)
      ? secondaryCategoryIds.filter((item) => item !== id)
      : secondaryCategoryIds.length < 2 ? [...secondaryCategoryIds, id] : secondaryCategoryIds;
    setSecondaryCategoryIds(next);
    keepSelectedSubcategories([primaryCategoryId, ...next]);
  };
  const toggleSubcategory = (id) => setSubcategoryIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleNotSure = (checked) => {
    setNotSure(checked);
    if (checked) { setPrimaryCategoryId(''); setSecondaryCategoryIds([]); setSubcategoryIds([]); }
  };

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <fieldset className={styles.block}>
        <legend>1. Tool details</legend>
        <div className={styles.twoColumns}><label>Tool name<input type="text" placeholder="Example: Acme AI" /></label><label>Official website<input type="url" placeholder="https://example.com" /></label></div>
        <label>Short description<textarea rows="3" placeholder="What does the tool help people do?" /></label>
      </fieldset>

      <fieldset className={styles.block}>
        <legend>2. Choose one primary category</legend>
        <p className={styles.help}>The primary category should describe the tool’s main job.</p>
        <label className={styles.categorySearch}>Search categories<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try SEO, law, summarizer or no code" /></label>
        <div className={styles.categoryGrid}>
          {filteredCategories.map((category) => <label className={`${styles.choice} ${primaryCategoryId === category.id ? styles.selected : ''}`} key={category.id}><input type="radio" name="primaryCategory" checked={primaryCategoryId === category.id} onChange={() => choosePrimary(category.id)} /><span><strong>{category.name}</strong><small>{category.description}</small></span></label>)}
        </div>
        {!filteredCategories.length && <p className={styles.empty}>No matching category. You can ask us to categorize the tool or suggest a category below.</p>}
      </fieldset>

      <fieldset className={styles.block} disabled={!primaryCategoryId || notSure}>
        <legend>3. Optional secondary categories</legend>
        <p className={styles.help}>Choose up to two only when the tool has another important use.</p>
        <div className={styles.secondaryGrid}>{categories.filter((item) => item.id !== primaryCategoryId).map((category) => <label className={styles.compactChoice} key={category.id}><input type="checkbox" checked={secondaryCategoryIds.includes(category.id)} disabled={!secondaryCategoryIds.includes(category.id) && secondaryCategoryIds.length >= 2} onChange={() => toggleSecondary(category.id)} />{category.name}</label>)}</div>
        <p className={styles.counter}>{secondaryCategoryIds.length}/2 selected</p>
      </fieldset>

      {selectedCategories.length > 0 && !notSure && <fieldset className={styles.block}>
        <legend>4. Relevant subcategories</legend>
        <p className={styles.help}>Only subcategories from the selected categories are available.</p>
        {selectedCategories.map((category) => <div className={styles.subcategoryGroup} key={category.id}><h2>{category.name}</h2><div>{category.subcategories.map((subcategory) => <label className={styles.compactChoice} key={subcategory.id}><input type="checkbox" checked={subcategoryIds.includes(subcategory.id)} onChange={() => toggleSubcategory(subcategory.id)} />{subcategory.name}</label>)}</div></div>)}
      </fieldset>}

      <div className={styles.helpOptions}>
        <label className={styles.notSure}><input type="checkbox" checked={notSure} onChange={(event) => toggleNotSure(event.target.checked)} /><span><strong>Not sure? Let us categorize it</strong><small>Your tool can be placed in the admin review queue without a public “Other” category.</small></span></label>
        <button type="button" className={styles.suggestButton} onClick={() => setSuggestOpen(!suggestOpen)} aria-expanded={suggestOpen}>Suggest a category</button>
        {suggestOpen && <label>Category suggestion<textarea rows="3" placeholder="Tell us which category is missing and why." /></label>}
      </div>

      {!notSure && !validation.valid && primaryCategoryId === '' && <p className={styles.validation}>Choose a primary category, or select “Not sure? Let us categorize it”.</p>}
      <a className={ui.primaryButton} href="mailto:hello@agencytoolguide.com?subject=Tool%20submission%20request">Email submission request</a>
      <p className={styles.previewNote}>This classification worksheet does not send or save data. Include your tool name, official website and preferred categories in the email request.</p>
    </form>
  );
}

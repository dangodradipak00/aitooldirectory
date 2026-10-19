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
  const [submitState, setSubmitState] = useState({ pending: false, error: '', success: '' });

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!notSure && !validation.valid) {
      setSubmitState({ pending: false, error: validation.errors[0] || 'Choose a primary category.', success: '' });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitState({ pending: true, error: '', success: '' });
    try {
      const response = await fetch('/api/submissions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: formData.get('toolName'), website: formData.get('website'), description: formData.get('description'),
          submitterName: formData.get('submitterName'), submitterEmail: formData.get('submitterEmail'),
          primaryCategoryId: notSure ? null : primaryCategoryId,
          secondaryCategoryIds: notSure ? [] : secondaryCategoryIds,
          subcategoryIds: notSure ? [] : subcategoryIds,
          categorySuggestion: formData.get('categorySuggestion') || '', websiteField: formData.get('websiteField') || ''
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed.');
      form.reset();
      setSearch(''); setPrimaryCategoryId(''); setSecondaryCategoryIds([]); setSubcategoryIds([]); setNotSure(false); setSuggestOpen(false);
      setSubmitState({ pending: false, error: '', success: 'Thank you. Your tool is now in the editorial review queue.' });
    } catch (error) {
      setSubmitState({ pending: false, error: error.message || 'Submission failed.', success: '' });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.block}>
        <legend>1. Tool details</legend>
        <div className={styles.twoColumns}><label>Tool name<input name="toolName" type="text" placeholder="Example: Acme AI" required /></label><label>Official website<input name="website" type="url" placeholder="https://example.com" required /></label></div>
        <label>Short description<textarea name="description" rows="3" minLength="20" placeholder="What does the tool help people do?" required /></label>
        <div className={styles.twoColumns}><label>Your name<input name="submitterName" type="text" autoComplete="name" required /></label><label>Contact email<input name="submitterEmail" type="email" autoComplete="email" required /></label></div>
        <label className={styles.honeypot} aria-hidden="true">Leave this field empty<input name="websiteField" tabIndex="-1" autoComplete="off" /></label>
      </fieldset>

      <fieldset className={styles.block}>
        <legend>2. Choose one primary category</legend>
        <p className={styles.help}>The primary category should describe the tool’s main job.</p>
        <label className={styles.categorySearch}>Search categories<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try SEO, law, summarizer or no code" /></label>
        <div className={styles.categoryGrid}>{filteredCategories.map((category) => <label className={`${styles.choice} ${primaryCategoryId === category.id ? styles.selected : ''}`} key={category.id}><input type="radio" name="primaryCategory" checked={primaryCategoryId === category.id} onChange={() => choosePrimary(category.id)} /><span><strong>{category.name}</strong><small>{category.description}</small></span></label>)}</div>
        {!filteredCategories.length && <p className={styles.empty}>No matching category. You can ask us to categorize the tool or suggest a category below.</p>}
      </fieldset>

      <fieldset className={styles.block} disabled={!primaryCategoryId || notSure}>
        <legend>3. Optional secondary categories</legend>
        <p className={styles.help}>Choose up to two only when the tool has another important use.</p>
        <div className={styles.secondaryGrid}>{categories.filter((item) => item.id !== primaryCategoryId).map((category) => <label className={styles.compactChoice} key={category.id}><input type="checkbox" checked={secondaryCategoryIds.includes(category.id)} disabled={!secondaryCategoryIds.includes(category.id) && secondaryCategoryIds.length >= 2} onChange={() => toggleSecondary(category.id)} />{category.name}</label>)}</div>
        <p className={styles.counter}>{secondaryCategoryIds.length}/2 selected</p>
      </fieldset>

      {selectedCategories.length > 0 && !notSure && <fieldset className={styles.block}><legend>4. Relevant subcategories</legend><p className={styles.help}>Only subcategories from the selected categories are available.</p>{selectedCategories.map((category) => <div className={styles.subcategoryGroup} key={category.id}><h2>{category.name}</h2><div>{category.subcategories.map((subcategory) => <label className={styles.compactChoice} key={subcategory.id}><input type="checkbox" checked={subcategoryIds.includes(subcategory.id)} onChange={() => toggleSubcategory(subcategory.id)} />{subcategory.name}</label>)}</div></div>)}</fieldset>}

      <div className={styles.helpOptions}>
        <label className={styles.notSure}><input type="checkbox" checked={notSure} onChange={(event) => toggleNotSure(event.target.checked)} /><span><strong>Not sure? Let us categorize it</strong><small>Your tool can enter the admin review queue without a public “Other” category.</small></span></label>
        <button type="button" className={styles.suggestButton} onClick={() => setSuggestOpen(!suggestOpen)} aria-expanded={suggestOpen}>Suggest a category</button>
        {suggestOpen && <label>Category suggestion<textarea name="categorySuggestion" rows="3" placeholder="Tell us which category is missing and why." /></label>}
      </div>

      {!notSure && !validation.valid && primaryCategoryId === '' && <p className={styles.validation}>Choose a primary category, or select “Not sure? Let us categorize it”.</p>}
      {submitState.error && <p className={styles.validation} role="alert">{submitState.error}</p>}
      {submitState.success && <p className={styles.success} role="status">{submitState.success}</p>}
      <button className={ui.primaryButton} disabled={submitState.pending} type="submit">{submitState.pending ? 'Submitting…' : 'Submit for review'}</button>
      <p className={styles.previewNote}>Submissions are reviewed before publication. Approval and search rankings are never guaranteed.</p>
    </form>
  );
}

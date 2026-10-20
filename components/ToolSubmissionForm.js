'use client';

import { useMemo, useState } from 'react';
import styles from './ToolSubmissionForm.module.css';
import ui from '../styles/ui.module.css';

const PAGE_TEMPLATE = `## What is this tool?

Explain what the tool does and the main problem it solves.

## How it works

1. Create an account.
2. Configure the tool for your workflow.
3. Review the results and take action.

## Pricing overview

Explain the available plans, limits and any free option.

## Key features

### Feature name

Explain what users can do with this feature.

## Conclusion

Summarize who the tool is best suited for.`;

const emptyPair = () => ({ first: '', second: '' });

function TextList({ title, name, values, setValues, placeholder, tone }) {
  const add = () => setValues((current) => [...current, '']);
  const remove = (index) => setValues((current) => current.length === 1 ? [''] : current.filter((_, itemIndex) => itemIndex !== index));
  return <div className={`${styles.listBox} ${tone === 'positive' ? styles.positive : styles.negative}`}>
    <div className={styles.rowHeading}><h3>{title}</h3><button type="button" onClick={add}>+ Add</button></div>
    {values.map((item, index) => <div className={styles.textRow} key={index}><span>{index + 1}</span><textarea name={name} rows="2" maxLength="500" value={item} onChange={(event) => setValues((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder={placeholder} /><button type="button" onClick={() => remove(index)} aria-label={`Remove ${title} item ${index + 1}`}>×</button></div>)}
  </div>;
}

function PairList({ title, addLabel, values, setValues, firstName, secondName, firstLabel, secondLabel, firstPlaceholder, secondPlaceholder }) {
  const add = () => setValues((current) => [...current, emptyPair()]);
  const remove = (index) => setValues((current) => current.length === 1 ? [emptyPair()] : current.filter((_, itemIndex) => itemIndex !== index));
  return <fieldset className={styles.block}>
    <div className={styles.sectionHeading}><h2>{title}</h2><button type="button" onClick={add}>+ {addLabel}</button></div>
    <div className={styles.pairRows}>{values.map((item, index) => <div className={styles.pairRow} key={index}>
      <span className={styles.number}>{index + 1}</span>
      <label>{firstLabel}<input name={firstName} type="text" maxLength="160" value={item.first} onChange={(event) => setValues((current) => current.map((value, itemIndex) => itemIndex === index ? { ...value, first: event.target.value } : value))} placeholder={firstPlaceholder} /></label>
      <label>{secondLabel}<textarea name={secondName} rows="2" maxLength="700" value={item.second} onChange={(event) => setValues((current) => current.map((value, itemIndex) => itemIndex === index ? { ...value, second: event.target.value } : value))} placeholder={secondPlaceholder} /></label>
      <button type="button" className={styles.removeButton} onClick={() => remove(index)} aria-label={`Remove ${title} item ${index + 1}`}>×</button>
    </div>)}</div>
  </fieldset>;
}

export default function ToolSubmissionForm({ categories }) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [subcategoryIds, setSubcategoryIds] = useState([]);
  const [notSure, setNotSure] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [pros, setPros] = useState(['']);
  const [cons, setCons] = useState(['']);
  const [useCases, setUseCases] = useState([emptyPair()]);
  const [faqs, setFaqs] = useState([emptyPair()]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [submitState, setSubmitState] = useState({ pending: false, error: '', success: '' });

  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return categories.filter((item) => !normalized || item.searchText.includes(normalized));
  }, [categories, search]);
  const selectedCategory = categories.find((category) => category.id === primaryCategoryId);
  const validPrimary = categories.some((category) => category.id === primaryCategoryId);
  const validSubcategories = !selectedCategory || subcategoryIds.every((id) => selectedCategory.subcategories.some((subcategory) => subcategory.id === id));
  const validation = notSure ? { valid: true, errors: [] } : { valid: validPrimary && validSubcategories, errors: validPrimary ? ['Choose subcategories from the selected primary category only.'] : ['Choose one primary category.'] };

  const choosePrimary = (id) => {
    setPrimaryCategoryId(id);
    setSubcategoryIds([]);
    setNotSure(false);
  };
  const toggleSubcategory = (id) => setSubcategoryIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleNotSure = (checked) => {
    setNotSure(checked);
    if (checked) { setPrimaryCategoryId(''); setSubcategoryIds([]); }
  };
  const resetControlledFields = () => {
    setStep(1);
    setSearch(''); setPrimaryCategoryId(''); setSubcategoryIds([]); setNotSure(false); setSuggestOpen(false);
    setContentMarkdown(''); setPros(['']); setCons(['']); setUseCases([emptyPair()]); setFaqs([emptyPair()]);
    setSeoTitle(''); setSeoDescription('');
  };
  const goToContent = (event) => {
    const form = event.currentTarget.form;
    const firstStep = form?.querySelector('[data-form-step="1"]');
    const invalid = firstStep ? [...firstStep.querySelectorAll('input, textarea, select')].find((field) => !field.checkValidity()) : null;
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    if (!validation.valid) {
      setSubmitState({ pending: false, error: validation.errors[0], success: '' });
      return;
    }
    setSubmitState({ pending: false, error: '', success: '' });
    setStep(2);
    window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!notSure && !validation.valid) {
      setSubmitState({ pending: false, error: validation.errors[0] || 'Choose a primary category.', success: '' });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('categorizeForMe', String(notSure));
    setSubmitState({ pending: true, error: '', success: '' });
    try {
      const response = await fetch('/api/submissions/', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed.');
      form.reset();
      resetControlledFields();
      setSubmitState({ pending: false, error: '', success: 'Thank you. Your complete tool profile is now in the admin review queue.' });
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    } catch (error) {
      setSubmitState({ pending: false, error: error.message || 'Submission failed.', success: '' });
    }
  };

  return <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
    <div className={styles.stepProgress} aria-label={`Step ${step} of 2`}>
      <div className={step === 1 ? styles.currentStep : styles.completedStep}><span>1</span><div><strong>Tool basics</strong><small>Details, media and category</small></div></div>
      <i aria-hidden="true" />
      <div className={step === 2 ? styles.currentStep : ''}><span>2</span><div><strong>Profile content</strong><small>Content, SEO and support</small></div></div>
    </div>

    <div className={`${styles.stepPanel} ${step !== 1 ? styles.stepHidden : ''}`} data-form-step="1" aria-hidden={step !== 1}>
    <fieldset className={styles.block}>
      <div className={styles.cardHeader}><h2>1. Tool and contact details</h2></div>
      <div className={styles.twoColumns}><label>Tool name *<input name="toolName" type="text" placeholder="Example: Acme AI" required /></label><label>Official website *<input name="website" type="url" placeholder="https://example.com" required /></label></div>
      <label>Short description *<textarea name="description" rows="4" minLength="20" maxLength="500" placeholder="A concise description for the tool page hero and directory cards." required /></label>
      <div className={styles.twoColumns}><label>Your name *<input name="submitterName" type="text" autoComplete="name" required /></label><label>Contact email *<input name="submitterEmail" type="email" autoComplete="email" required /></label></div>
      <div className={styles.pricingBlock}><span>Pricing tag *</span><div>{['Free', 'Freemium', 'Paid'].map((pricing) => <label key={pricing}><input name="pricing" type="radio" value={pricing} required />{pricing}</label>)}</div></div>
      <label className={styles.honeypot} aria-hidden="true">Leave this field empty<input name="websiteField" tabIndex="-1" autoComplete="off" /></label>
    </fieldset>

    <fieldset className={styles.block}>
      <div className={styles.cardHeader}><h2>2. Tool gallery</h2></div>
      <div className={styles.uploadGrid}><label>Tool logo<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp,image/avif" /><small>PNG, JPG, WEBP or AVIF · Max 2 MB</small></label><label>Tool website image<input name="websiteImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/avif" /><small>PNG, JPG, WEBP or AVIF · Max 5 MB</small></label></div>
    </fieldset>

    <fieldset className={styles.block}>
      <div className={styles.cardHeader}><h2>3. Choose one primary category</h2></div>
      <p className={styles.help}>The primary category should describe the tool’s main job.</p>
      <label className={styles.categorySearch}>Search categories<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try SEO, law, summarizer or no code" /></label>
      <div className={styles.categoryGrid}>{filteredCategories.map((category) => <label className={`${styles.choice} ${primaryCategoryId === category.id ? styles.selected : ''}`} key={category.id}><input type="radio" name="primaryCategoryId" value={category.id} checked={primaryCategoryId === category.id} onChange={() => choosePrimary(category.id)} /><span><strong>{category.name}</strong><small>{category.description}</small></span></label>)}</div>
      {!filteredCategories.length && <p className={styles.empty}>No matching category. Ask us to categorize the tool or suggest a category below.</p>}
    </fieldset>

    {selectedCategory && !notSure && <fieldset className={styles.block}><div className={styles.cardHeader}><h2>4. Choose relevant subcategories</h2></div><p className={styles.help}>Only subcategories from {selectedCategory.name} are available.</p><div className={styles.subcategoryGroup}><h2>{selectedCategory.name}</h2><div>{selectedCategory.subcategories.map((subcategory) => <label className={styles.compactChoice} key={subcategory.id}><input name="subcategoryIds" type="checkbox" value={subcategory.id} checked={subcategoryIds.includes(subcategory.id)} onChange={() => toggleSubcategory(subcategory.id)} />{subcategory.name}</label>)}</div></div></fieldset>}

    <div className={styles.helpOptions}>
      <label className={styles.notSure}><input type="checkbox" checked={notSure} onChange={(event) => toggleNotSure(event.target.checked)} /><span><strong>Not sure? Let us categorize it</strong><small>Your request can enter review without choosing the wrong category.</small></span></label>
      <button type="button" className={styles.suggestButton} onClick={() => setSuggestOpen(!suggestOpen)} aria-expanded={suggestOpen}>Suggest a category</button>
      {suggestOpen && <label>Category suggestion<textarea name="categorySuggestion" rows="3" placeholder="Tell us which category is missing and why." /></label>}
    </div>

    {!notSure && !validation.valid && primaryCategoryId === '' && <p className={styles.validation}>Choose a primary category, or select “Not sure? Let us categorize it”.</p>}
    {step === 1 && submitState.error && <p className={styles.validation} role="alert">{submitState.error}</p>}
    <div className={styles.stepActions}><button className={ui.primaryButton} type="button" onClick={goToContent}>Continue to profile content <span aria-hidden="true">→</span></button></div>
    </div>

    <div className={`${styles.stepPanel} ${step !== 2 ? styles.stepHidden : ''}`} data-form-step="2" aria-hidden={step !== 2}>
    <fieldset className={styles.block}>
      <div className={styles.sectionHeading}><h2>5. Complete page content</h2><button type="button" onClick={() => { if (!contentMarkdown.trim() || window.confirm('Replace the current content with the template?')) setContentMarkdown(PAGE_TEMPLATE); }}>Insert template</button></div>
      <p className={styles.help}>Write the main page content in Markdown. Include the introduction, workflow, pricing overview, key features and conclusion.</p>
      <textarea className={styles.contentEditor} name="contentMarkdown" rows="24" minLength="80" value={contentMarkdown} onChange={(event) => setContentMarkdown(event.target.value)} required placeholder="Use the template or write the complete tool page content..." />
      <small className={styles.characterCount}>{contentMarkdown.length.toLocaleString()} characters</small>
    </fieldset>

    <fieldset className={styles.block}><div className={styles.cardHeader}><h2>6. Pros and cons</h2></div><div className={styles.proConGrid}><TextList title="Pros" name="pros" tone="positive" values={pros} setValues={setPros} placeholder="Explain one clear advantage..." /><TextList title="Cons" name="cons" tone="negative" values={cons} setValues={setCons} placeholder="Explain one important limitation..." /></div></fieldset>

    <PairList title="7. Use cases" addLabel="Add use case" values={useCases} setValues={setUseCases} firstName="useCaseTitles" secondName="useCaseDescriptions" firstLabel="Use case title" secondLabel="Description" firstPlaceholder="e.g. Competitor research" secondPlaceholder="Explain how the tool helps in this situation." />
    <PairList title="8. Frequently asked questions" addLabel="Add FAQ" values={faqs} setValues={setFaqs} firstName="faqQuestions" secondName="faqAnswers" firstLabel="Question" secondLabel="Answer" firstPlaceholder="e.g. Is this tool free?" secondPlaceholder="Write a direct and useful answer." />

    <fieldset className={styles.block}>
      <div className={styles.cardHeader}><h2>9. SEO</h2></div>
      <label><span className={styles.labelRow}><span>SEO title</span><small>{seoTitle.length}/60</small></span><input name="seoTitle" type="text" maxLength="60" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} /></label>
      <label><span className={styles.labelRow}><span>SEO description</span><small>{seoDescription.length}/160</small></span><textarea name="seoDescription" rows="4" maxLength="160" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} /></label>
    </fieldset>

    <fieldset className={styles.block}>
      <div className={styles.cardHeader}><h2>10. Social and support</h2></div>
      <div className={styles.twoColumns}><label>X / Twitter URL<input name="xUrl" type="url" placeholder="https://x.com/..." /></label><label>LinkedIn URL<input name="linkedinUrl" type="url" placeholder="https://linkedin.com/..." /></label><label>Facebook URL<input name="facebookUrl" type="url" placeholder="https://facebook.com/..." /></label><label>YouTube URL<input name="youtubeUrl" type="url" placeholder="https://youtube.com/..." /></label></div>
      <label>Support email<input name="supportEmail" type="email" placeholder="support@example.com" /></label>
    </fieldset>

    {submitState.error && <p className={styles.validation} role="alert">{submitState.error}</p>}
    {submitState.success && <p className={styles.success} role="status">{submitState.success}</p>}
    <div className={styles.stepActions}><button className={styles.backButton} type="button" onClick={(event) => { setSubmitState({ pending: false, error: '', success: '' }); setStep(1); window.scrollTo({ top: event.currentTarget.form.offsetTop - 100, behavior: 'smooth' }); }}>← Back</button><button className={ui.primaryButton} disabled={submitState.pending} type="submit">{submitState.pending ? 'Submitting…' : 'Submit complete tool profile'}</button></div>
    <p className={styles.previewNote}>Your request appears in our private admin queue. We contact you before manual payment and publication.</p>
    </div>
  </form>;
}

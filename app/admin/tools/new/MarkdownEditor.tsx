'use client';

import { useRef, useState } from 'react';
import MarkdownContent from '@/components/MarkdownContent';
import styles from '../../admin.module.css';

const TEMPLATE = `## What is this tool?

Explain what the tool does and the main problem it solves.

## How it works

1. Create an account.
2. Configure the tool for your workflow.
3. Review the results and take action.

## Pricing overview

Explain the available plans, limits and any free option. Ask readers to confirm current pricing on the official website.

## Key features

### Feature name

Explain what users can do with this feature.

## Conclusion

Summarize who the tool is best suited for and the main points readers should consider.`;

type Format = 'h2' | 'h3' | 'bold' | 'italic' | 'bullet' | 'number' | 'quote' | 'divider' | 'table';
type LinkFollow = 'dofollow' | 'nofollow';
type LinkDraft = {
  start: number;
  end: number;
  text: string;
  url: string;
  follow: LinkFollow;
};

export default function MarkdownEditor({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [linkDraft, setLinkDraft] = useState<LinkDraft | null>(null);
  const [linkError, setLinkError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const format = (type: Format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    let replacement = selected;
    if (type === 'h2') replacement = `## ${selected}`;
    if (type === 'h3') replacement = `### ${selected}`;
    if (type === 'bold') replacement = `**${selected}**`;
    if (type === 'italic') replacement = `*${selected}*`;
    if (type === 'bullet') replacement = selected.split('\n').map((line) => `- ${line}`).join('\n');
    if (type === 'number') replacement = selected.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
    if (type === 'quote') replacement = selected.split('\n').map((line) => `> ${line}`).join('\n');
    if (type === 'divider') replacement = '\n\n---\n\n';
    if (type === 'table') replacement = '\n\n| Item | Details |\n| --- | --- |\n| Example | Add details |\n\n';
    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    });
  };

  const openLinkEditor = () => {
    setMode('write');
    setLinkError('');
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? start;
      setLinkDraft({
        start,
        end,
        text: value.slice(start, end),
        url: '',
        follow: 'dofollow',
      });
    });
  };

  const insertLink = () => {
    if (!linkDraft) return;
    const text = linkDraft.text.trim();
    const url = linkDraft.url.trim();
    if (!text) {
      setLinkError('Add the anchor text shown to readers.');
      return;
    }
    if (!/^(https?:\/\/|\/(?!\/)|#|mailto:)/i.test(url)) {
      setLinkError('Use an internal path such as /tools/ahrefs/ or a complete https:// URL.');
      return;
    }

    const anchor = text.replaceAll(']', '\\]');
    const destination = url.replaceAll(')', '%29').replaceAll('"', '%22');
    const replacement = `[${anchor}](${destination} "${linkDraft.follow}")`;
    const next = `${value.slice(0, linkDraft.start)}${replacement}${value.slice(linkDraft.end)}`;
    const cursor = linkDraft.start + replacement.length;
    setValue(next);
    setLinkDraft(null);
    setLinkError('');
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <section className={`${styles.formCard} ${styles.markdownCard}`}>
      <div className={styles.markdownHeading}>
        <div><h2>Page Content</h2><p>Write the complete main page content here, including key features and conclusion. Pros, cons, use cases and FAQs are managed separately below.</p></div>
        <button type="button" onClick={() => { if (!value.trim() || window.confirm('Replace the current content with the page template?')) setValue(TEMPLATE); }}>Insert page template</button>
      </div>
      <div className={styles.markdownEditor}>
        <div className={styles.markdownTabs}>
          <button type="button" className={mode === 'write' ? styles.markdownTabActive : ''} onClick={() => setMode('write')}>Write</button>
          <button type="button" className={mode === 'preview' ? styles.markdownTabActive : ''} onClick={() => { setMode('preview'); setLinkDraft(null); }}>Preview</button>
          <span>{value.length.toLocaleString()} characters</span>
        </div>
        <div className={styles.markdownToolbar} aria-label="Markdown formatting toolbar">
          <button type="button" onClick={() => format('h2')} title="Heading 2">H2</button>
          <button type="button" onClick={() => format('h3')} title="Heading 3">H3</button>
          <button type="button" onClick={() => format('bold')} title="Bold"><strong>B</strong></button>
          <button type="button" onClick={() => format('italic')} title="Italic"><em>I</em></button>
          <button type="button" onClick={openLinkEditor} title="Insert SEO link">Link</button>
          <button type="button" onClick={() => format('bullet')} title="Bulleted list">• List</button>
          <button type="button" onClick={() => format('number')} title="Numbered list">1. List</button>
          <button type="button" onClick={() => format('quote')} title="Quote">Quote</button>
          <button type="button" onClick={() => format('divider')} title="Divider">—</button>
          <button type="button" onClick={() => format('table')} title="Table">Table</button>
        </div>
        {linkDraft && (
          <div className={styles.linkPanel} role="dialog" aria-label="Insert link">
            <div className={styles.linkFields}>
              <label>
                <span>Anchor text</span>
                <input
                  type="text"
                  value={linkDraft.text}
                  onChange={(event) => setLinkDraft({ ...linkDraft, text: event.target.value })}
                  placeholder="e.g. Explore Ahrefs"
                  autoFocus
                />
              </label>
              <label>
                <span>Link URL</span>
                <input
                  type="text"
                  value={linkDraft.url}
                  onChange={(event) => { setLinkDraft({ ...linkDraft, url: event.target.value }); setLinkError(''); }}
                  onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); insertLink(); } }}
                  placeholder="/tools/ahrefs/ or https://example.com"
                />
              </label>
            </div>
            <fieldset className={styles.linkType}>
              <legend>SEO link type</legend>
              <label>
                <input type="radio" name="markdownLinkFollow" checked={linkDraft.follow === 'dofollow'} onChange={() => setLinkDraft({ ...linkDraft, follow: 'dofollow' })} />
                <span><strong>Do-follow</strong><small>Recommended for useful internal links</small></span>
              </label>
              <label>
                <input type="radio" name="markdownLinkFollow" checked={linkDraft.follow === 'nofollow'} onChange={() => setLinkDraft({ ...linkDraft, follow: 'nofollow' })} />
                <span><strong>No-follow</strong><small>For sponsored or untrusted destinations</small></span>
              </label>
            </fieldset>
            {linkError && <p className={styles.linkError} role="alert">{linkError}</p>}
            <div className={styles.linkActions}>
              <button type="button" onClick={() => { setLinkDraft(null); setLinkError(''); }}>Cancel</button>
              <button type="button" onClick={insertLink}>Insert link</button>
            </div>
          </div>
        )}
        {mode === 'write' ? (
          <textarea ref={textareaRef} name="contentMarkdown" value={value} onChange={(event) => setValue(event.target.value)} minLength={80} required rows={28} placeholder="Write the full page content here, or use Insert page template..." />
        ) : (
          <div className={styles.markdownPreview}>{value.trim() ? <MarkdownContent content={value} className={styles.markdownBody} /> : <p>Nothing to preview yet.</p>}</div>
        )}
        {mode === 'preview' && <input type="hidden" name="contentMarkdown" value={value} />}
      </div>
      <small className={styles.fieldHelp}>Use H2 for main sections and H3 for subsections. Links can be Do-follow or No-follow; raw HTML is ignored for security.</small>
    </section>
  );
}

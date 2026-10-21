'use client';

import { useRef, useState } from 'react';
import MarkdownContent from '@/components/MarkdownContent';
import styles from '../../admin.module.css';

const DEFAULT_TEMPLATE = `## What is this tool?

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
type ImageDraft = {
  file: File;
  alt: string;
  start: number;
  end: number;
};

function wrapInlineMarkdown(value: string, marker: string) {
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const content = value.slice(leading.length, value.length - trailing.length);
  return content ? `${leading}${marker}${content}${marker}${trailing}` : value;
}

function richHtmlToMarkdown(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');

  const convertChildren = (element: Element) => Array.from(element.childNodes).map(convertNode).join('');
  const convertList = (element: Element, ordered: boolean): string => {
    const items = Array.from(element.children).filter((child) => child.tagName.toLowerCase() === 'li');
    return `${items.map((item, index): string => {
      const nested = Array.from(item.children).filter((child) => ['ul', 'ol'].includes(child.tagName.toLowerCase()));
      const body = Array.from(item.childNodes)
        .filter((child) => !(child instanceof Element && ['ul', 'ol'].includes(child.tagName.toLowerCase())))
        .map(convertNode)
        .join('')
        .replace(/\s*\n+\s*/g, ' ')
        .trim();
      const nestedMarkdown: string = nested.map((child) => convertList(child, child.tagName.toLowerCase() === 'ol').trim().replace(/^/gm, '  ')).join('\n');
      return `${ordered ? `${index + 1}.` : '-'} ${body}${nestedMarkdown ? `\n${nestedMarkdown}` : ''}`;
    }).join('\n')}\n\n`;
  };
  const convertTable = (element: Element) => {
    const rows = Array.from(element.querySelectorAll('tr')).map((row) =>
      Array.from(row.querySelectorAll(':scope > th, :scope > td')).map((cell) =>
        convertChildren(cell).replace(/\s*\n+\s*/g, ' ').replaceAll('|', '\\|').trim()
      )
    ).filter((row) => row.length > 0);
    if (!rows.length) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const normalized = rows.map((row) => [...row, ...Array(Math.max(0, width - row.length)).fill('')]);
    const line = (row: string[]) => `| ${row.join(' | ')} |`;
    return `${line(normalized[0])}\n${line(Array(width).fill('---'))}\n${normalized.slice(1).map(line).join('\n')}\n\n`;
  };
  function convertNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return (node.textContent || '').replace(/\u00a0/g, ' ');
    if (!(node instanceof Element)) return '';
    const tag = node.tagName.toLowerCase();
    if (['script', 'style', 'meta', 'title', 'svg'].includes(tag)) return '';
    if (tag === 'br') return '\n';
    if (tag === 'hr') return '\n\n---\n\n';
    if (tag === 'ul') return convertList(node, false);
    if (tag === 'ol') return convertList(node, true);
    if (tag === 'table') return convertTable(node);

    let content = convertChildren(node);
    if (tag === 'a') {
      const href = node.getAttribute('href')?.trim();
      return href && content.trim() ? `[${content.trim()}](${href.replaceAll(')', '%29')})` : content;
    }
    if (/^h[1-6]$/.test(tag)) {
      const sourceLevel = Number(tag.slice(1));
      const level = sourceLevel <= 2 ? 2 : Math.min(sourceLevel, 6);
      return `\n\n${'#'.repeat(level)} ${content.trim()}\n\n`;
    }
    if (tag === 'blockquote') return `\n\n${content.trim().split('\n').map((line) => `> ${line}`).join('\n')}\n\n`;
    if (['p', 'div', 'section', 'article'].includes(tag)) return `${content.trim()}\n\n`;

    const style = (node.getAttribute('style') || '').toLowerCase();
    const bold = tag === 'strong' || tag === 'b' || /font-weight\s*:\s*(?:bold|[6-9]00)/.test(style);
    const italic = tag === 'em' || tag === 'i' || /font-style\s*:\s*italic/.test(style);
    if (bold) content = wrapInlineMarkdown(content, '**');
    if (italic) content = wrapInlineMarkdown(content, '*');
    return content;
  }

  return convertChildren(document.body)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function MarkdownEditor({
  initialValue = '',
  fieldName = 'contentMarkdown',
  heading = 'Page Content',
  description = 'Write the complete main page content here, including key features and conclusion. Pros, cons, use cases and FAQs are managed separately below.',
  template = DEFAULT_TEMPLATE,
  minLength = 80,
  placeholder = 'Write the full page content here, or use Insert page template...',
  allowImageUpload = false
}: {
  initialValue?: string;
  fieldName?: string;
  heading?: string;
  description?: string;
  template?: string;
  minLength?: number;
  placeholder?: string;
  allowImageUpload?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [linkDraft, setLinkDraft] = useState<LinkDraft | null>(null);
  const [linkError, setLinkError] = useState('');
  const [imageDraft, setImageDraft] = useState<ImageDraft | null>(null);
  const [imageError, setImageError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageSelectionRef = useRef({ start: 0, end: 0 });

  const pasteRichText = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = event.clipboardData.getData('text/html');
    if (!html) return;
    const markdown = richHtmlToMarkdown(html);
    if (!markdown) return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const prefix = before && !before.endsWith('\n') ? '\n\n' : '';
    const suffix = after && !after.startsWith('\n') ? '\n\n' : '';
    const replacement = `${prefix}${markdown}${suffix}`;
    setValue(`${before}${replacement}${after}`);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    });
  };

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

  const chooseImage = () => {
    setMode('write');
    setLinkDraft(null);
    setImageError('');
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      imageSelectionRef.current = {
        start: textarea?.selectionStart ?? value.length,
        end: textarea?.selectionEnd ?? value.length
      };
      imageInputRef.current?.click();
    });
  };

  const prepareImage = (file?: File) => {
    if (!file) return;
    const suggestedAlt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
    setImageDraft({ file, alt: suggestedAlt, ...imageSelectionRef.current });
    setImageError('');
  };

  const uploadAndInsertImage = async () => {
    if (!imageDraft || imageUploading) return;
    const alt = imageDraft.alt.trim();
    if (!alt) {
      setImageError('Add short alt text that describes the image.');
      return;
    }
    setImageUploading(true);
    setImageError('');
    try {
      const body = new FormData();
      body.set('file', imageDraft.file);
      const response = await fetch('/api/admin/blog-images/', { method: 'POST', body });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'Image upload failed.');
      const safeAlt = alt.replaceAll('[', '\\[').replaceAll(']', '\\]');
      const replacement = `\n\n![${safeAlt}](${result.url})\n\n`;
      const next = `${value.slice(0, imageDraft.start)}${replacement}${value.slice(imageDraft.end)}`;
      const cursor = imageDraft.start + replacement.length;
      setValue(next);
      setImageDraft(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(cursor, cursor);
      });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <section className={`${styles.formCard} ${styles.markdownCard}`}>
      <div className={styles.markdownHeading}>
        <div><h2>{heading}</h2><p>{description}</p></div>
        <button type="button" onClick={() => { if (!value.trim() || window.confirm('Replace the current content with the page template?')) setValue(template); }}>Insert page template</button>
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
          {allowImageUpload ? <>
            <button type="button" onClick={chooseImage} title="Upload and insert an image">Image</button>
            <input ref={imageInputRef} className={styles.hiddenFileInput} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => prepareImage(event.target.files?.[0])} />
          </> : null}
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
        {imageDraft && (
          <div className={`${styles.linkPanel} ${styles.imageInsertPanel}`} role="dialog" aria-label="Insert article image">
            <div className={styles.imageFileSummary}>
              <strong>{imageDraft.file.name}</strong>
              <small>{(imageDraft.file.size / 1024 / 1024).toFixed(2)} MB · Stored in Neon Object Storage</small>
            </div>
            <div className={styles.linkFields}>
              <label>
                <span>Image alt text</span>
                <input value={imageDraft.alt} onChange={(event) => { setImageDraft({ ...imageDraft, alt: event.target.value }); setImageError(''); }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void uploadAndInsertImage(); } }} placeholder="Describe what the image shows" autoFocus />
              </label>
            </div>
            <div className={styles.linkActions}>
              <button type="button" disabled={imageUploading} onClick={() => { setImageDraft(null); setImageError(''); if (imageInputRef.current) imageInputRef.current.value = ''; }}>Cancel</button>
              <button type="button" disabled={imageUploading} onClick={() => void uploadAndInsertImage()}>{imageUploading ? 'Uploading…' : 'Upload & insert'}</button>
            </div>
            {imageError && <p className={styles.linkError} role="alert">{imageError}</p>}
          </div>
        )}
        {mode === 'write' ? (
          <textarea ref={textareaRef} name={fieldName} value={value} onChange={(event) => setValue(event.target.value)} onPaste={pasteRichText} minLength={minLength} required rows={28} placeholder={placeholder} />
        ) : (
          <div className={styles.markdownPreview}>{value.trim() ? <MarkdownContent content={value} className={styles.markdownBody} /> : <p>Nothing to preview yet.</p>}</div>
        )}
        {mode === 'preview' && <input type="hidden" name={fieldName} value={value} />}
      </div>
      <small className={styles.fieldHelp}>Use H2 for main sections and H3 for subsections. Links can be Do-follow or No-follow; raw HTML is ignored for security.</small>
    </section>
  );
}

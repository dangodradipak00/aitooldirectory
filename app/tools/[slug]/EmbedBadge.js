'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function EmbedBadge({ toolName, slug }) {
  const [theme, setTheme] = useState('light');
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const toolUrl = `${origin}/tools/${slug}/`;
  const isDark = theme === 'dark';
  const embedCode = `<a href="${toolUrl}" target="_blank" rel="nofollow noopener noreferrer" aria-label="${toolName} featured on AgencyToolGuide" style="display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid ${isDark ? '#334155' : '#dbe3ee'};border-radius:10px;background:${isDark ? '#0f172a' : '#ffffff'};color:${isDark ? '#f8fafc' : '#14213d'};font-family:Arial,sans-serif;text-decoration:none"><span style="display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:#0876d1;color:#fff;font-weight:800">A</span><span style="display:grid;line-height:1.15"><small style="color:${isDark ? '#94a3b8' : '#6c7890'};font-size:10px">Featured on</small><strong style="font-size:14px">AgencyToolGuide</strong></span></a>`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={styles.embedCard}>
      <div className={styles.embedCopy}>
        <span className={styles.embedEyebrow}>Share your feature</span>
        <h2>{toolName} embed badge</h2>
        <p>Add this badge to your website, product page or footer to show that {toolName} is listed on AgencyToolGuide.</p>
      </div>

      <div className={styles.embedBuilder}>
        <div className={styles.themeSwitch} aria-label="Badge appearance">
          <button type="button" className={theme === 'light' ? styles.themeActive : undefined} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>Light</button>
          <button type="button" className={theme === 'dark' ? styles.themeActive : undefined} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>Dark</button>
        </div>

        <a className={`${styles.embedPreview} ${isDark ? styles.embedPreviewDark : ''}`} href={`/tools/${slug}/`} aria-label={`${toolName} featured on AgencyToolGuide`}>
          <span className={styles.embedLogo}>A</span>
          <span><small>Featured on</small><strong>AgencyToolGuide</strong></span>
          <span className={styles.embedStar} aria-hidden="true">★</span>
        </a>

        <button className={styles.copyEmbedButton} type="button" onClick={copyCode} disabled={!origin}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
          {copied ? 'Copied!' : 'Copy embed code'}
        </button>
        <span className={styles.copyStatus} aria-live="polite">{copied ? 'Embed code copied to clipboard.' : ''}</span>
      </div>
    </div>
  );
}

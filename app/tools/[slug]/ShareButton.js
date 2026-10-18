'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

function ShareGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></svg>;
}

export default function ShareButton({ title }) {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    setPageUrl(window.location.href);
    const closeMenu = (event) => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !rootRef.current?.contains(event.target))) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeMenu);
    document.addEventListener('keydown', closeMenu);
    return () => {
      document.removeEventListener('pointerdown', closeMenu);
      document.removeEventListener('keydown', closeMenu);
    };
  }, []);

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: 'Share on X', text: '𝕏', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'Share on Facebook', text: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Share on LinkedIn', text: 'in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'Share on Telegram', text: '➤', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'Share by email', text: '✉', href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}` }
  ];

  return (
    <div className={styles.shareRoot} ref={rootRef}>
      <button className={styles.shareButton} type="button" aria-label="Share this tool" aria-expanded={open} aria-controls="tool-share-menu" onClick={() => setOpen((value) => !value)}>
        <ShareGlyph />
      </button>
      {open && (
        <div className={styles.shareMenu} id="tool-share-menu" role="menu" aria-label="Share this tool">
          {links.map((link) => (
            <a key={link.label} href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" role="menuitem" aria-label={link.label} title={link.label}>{link.text}</a>
          ))}
        </div>
      )}
    </div>
  );
}

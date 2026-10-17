'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookmarkIcon, MenuIcon } from './Icons';
import styles from './Header.module.css';

const SAVED_KEY = 'agency-tool-guide-saved';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.body.dataset.theme === 'dark');
  }, []);

  useEffect(() => {
    const refreshCount = () => {
      try {
        setSavedCount(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]').length);
      } catch {
        setSavedCount(0);
      }
    };
    refreshCount();
    window.addEventListener('saved-tools-updated', refreshCount);
    return () => window.removeEventListener('saved-tools-updated', refreshCount);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const showSaved = () => {
    window.dispatchEvent(new Event('show-saved-tools'));
    document.getElementById('directory')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = darkMode ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem('agency-tool-guide-theme', nextTheme);
    setDarkMode(nextTheme === 'dark');
  };

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <div className={styles.previewBar}>Editorial preview · Product details are being reviewed</div>
      <header className={styles.siteHeader}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <Link href="/" className={styles.brand} aria-label="AgencyToolGuide home">
            <span className={styles.brandMark}>A</span>
            <span>AgencyTool<span>Guide</span></span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href="/#directory">Find tools</Link>
            <Link href="/categories/">Categories</Link>
            <Link href="/#how-it-works">How we review</Link>
            <Link href="/#guides">Guides</Link>
          </nav>

          <div className={styles.headerActions}>
            <button className={styles.themeButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`} title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              {darkMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
              )}
            </button>
            <button className={styles.savedButton} type="button" onClick={showSaved} aria-label={`Show saved tools. ${savedCount} saved`}>
              <BookmarkIcon filled={savedCount > 0} />
              <span className={styles.savedLabel}>Saved</span>
              {savedCount > 0 && <span className={styles.savedCount}>{savedCount}</span>}
            </button>
            <button className={styles.menuButton} type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <Link href="/#directory" onClick={() => setMenuOpen(false)}>Find tools</Link>
            <Link href="/categories/" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link href="/submit/" onClick={() => setMenuOpen(false)}>Submit a tool</Link>
            <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>How we review</Link>
            <Link href="/#guides" onClick={() => setMenuOpen(false)}>Guides</Link>
            <button type="button" onClick={showSaved}>Saved tools ({savedCount})</button>
          </nav>
        )}
      </header>
    </>
  );
}

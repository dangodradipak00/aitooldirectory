'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.body.dataset.theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = darkMode ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem('agency-tool-guide-theme', nextTheme);
    setDarkMode(nextTheme === 'dark');
  };

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <header className={styles.siteHeader}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <Link href="/" className={styles.brand} aria-label="AgencyToolGuide home">
            <span className={styles.brandMark}>A</span>
            <span className={styles.brandText}>AgencyTool<span>Guide</span></span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href="/categories/">Categories</Link>
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.submitButton} href="/submit/">Submit tool</Link>
            <button className={styles.themeButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`} title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              {darkMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

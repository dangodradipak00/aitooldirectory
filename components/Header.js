'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MenuIcon } from './Icons';
import styles from './Header.module.css';

export default function Header({ heroContrast = false }) {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDarkMode(document.body.dataset.theme === 'dark');
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = darkMode ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem('freemium-ai-tools-theme', nextTheme);
    setDarkMode(nextTheme === 'dark');
  };

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <header className={`${styles.siteHeader} ${heroContrast && darkMode ? styles.heroContrast : ''} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <Link href="/" className={styles.brand} aria-label="FreemiumAITools home">
            <span className={styles.brandMark}>F</span>
            <span className={styles.brandText}>FreemiumAI<span>Tools</span></span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href="/categories/">Categories</Link>
            <Link href="/blog/">Blog</Link>
            <Link href="/contact/">Contact</Link>
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
            <button className={styles.menuButton} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className={styles.mobileMenu} aria-label="Mobile navigation">
            <Link href="/categories/" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link href="/blog/" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/contact/" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>
        )}
      </header>
    </>
  );
}

import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import styles from './InfoPage.module.css';
import ui from '../styles/ui.module.css';
import { siteEmail } from '../lib/site';

export const contactEmail = siteEmail;

export default function InfoPage({ eyebrow, title, intro, children, effective, updated = 'October 22, 2026', showDates = true }) {
  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={styles.heroBand}>
          <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><span>{title}</span></div>
          <header className={styles.hero}>
            <div className={ui.shell}>
              <h1>{title}</h1>
              {showDates && <div className={styles.policyDates}>
                {effective && <small>Effective date: {effective}</small>}
                <small>Last updated: {updated}</small>
              </div>}
            </div>
          </header>
        </div>
        <div className={`${ui.shell} ${styles.contentWrap}`}>
          <article className={styles.article}>
            {intro && <p className={styles.articleIntro}>{intro}</p>}
            {children}
          </article>
          <aside className={styles.sideCard}>
            <span>Questions or corrections?</span>
            <p>Tell us if something on this page is unclear or needs updating.</p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

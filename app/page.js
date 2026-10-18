import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import HomepageCategories from '../components/HomepageCategories';
import { ArrowIcon } from '../components/Icons';
import { getCategory, homepageCategoryIds } from '../data/categories';
import { getToolsByCategory, publishedTools } from '../data/tools';
import styles from './page.module.css';
import ui from '../styles/ui.module.css';
import { absoluteUrl, siteName } from '../lib/site';

export const metadata = {
  title: 'AI & Agency Software Directory',
  description: 'Research AI, SEO, reporting and agency software by workflow, pricing model and practical fit.',
  alternates: { canonical: '/' },
  openGraph: { title: 'AgencyToolGuide Software Directory', description: 'Research software by workflow, pricing model and practical fit.', url: '/' }
};

export default function HomePage() {
  const tools = publishedTools;
  const homepageCategories = homepageCategoryIds.map((categoryId) => ({
    category: getCategory(categoryId),
    tools: getToolsByCategory(categoryId)
  }));
  const populatedCategoryCount = homepageCategories.filter(({ tools: categoryTools }) => categoryTools.length > 0).length;
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${absoluteUrl('/')}#website`, url: absoluteUrl('/'), name: siteName, alternateName: 'Agency Tool Guide' },
      { '@type': 'Organization', '@id': `${absoluteUrl('/')}#organization`, name: siteName, url: absoluteUrl('/'), email: 'hello@agencytoolguide.com' }
    ]
  };
  return (
    <>
      <JsonLd data={homeSchema} />
      <Header />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={`${styles.heroOrb} ${styles.heroOrbOne}`} />
          <div className={`${styles.heroOrb} ${styles.heroOrbTwo}`} />
          <div className={`${ui.shell} ${styles.heroContent}`}>
            <div className={styles.heroCopy}>
              <span className={ui.eyebrow}><span className={styles.eyebrowDot} /> Built for small marketing agencies</span>
              <h1>Choose agency software without the guesswork.</h1>
              <p>Explore practical options for client reporting, SEO audits and call tracking—organized around the work your agency actually does.</p>
              <div className={styles.heroActions}>
                <a href="#directory" className={ui.primaryButton}>Explore tools <ArrowIcon /></a>
                <Link href="/categories/" className={ui.secondaryButton}>Browse categories</Link>
              </div>
              <div className={styles.heroNote}>
                <strong>{tools.length} tools</strong><span /> <strong>{populatedCategoryCount} focused categories</strong><span /> No account required
              </div>
            </div>

            <div className={styles.heroPreview} aria-label="Example software shortlist">
              <div className={styles.previewWindow}>
                <div className={styles.previewWindowTop}><i /><i /><i /><span>Reporting shortlist</span></div>
                <div className={styles.previewSearch}><span>⌕</span> client reporting</div>
                {tools.filter((tool) => tool.primaryCategoryId === 'data-analytics').map((tool, index) => (
                  <div className={styles.miniTool} key={tool.slug}>
                    <span className={`${styles.miniLogo} ${styles[`mini${index + 1}`]}`}>{tool.initials}</span>
                    <span><strong>{tool.name}</strong><small>{tool.pricing}</small></span>
                    <b>→</b>
                  </div>
                ))}
              </div>
              <div className={`${styles.floatingChip} ${styles.floatingChipOne}`}>Clear comparisons</div>
              <div className={`${styles.floatingChip} ${styles.floatingChipTwo}`}>Agency-focused</div>
            </div>
          </div>
        </section>

        <HomepageCategories categories={homepageCategories} />

      </main>
      <Footer />
    </>
  );
}

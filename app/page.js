import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import HomepageCategories from '../components/HomepageCategories';
import { ArrowIcon } from '../components/Icons';
import { GridPulse } from '../components/ui/grid-pulse';
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

const featuredAiTools = [
  { name: 'ChatGPT', website: 'https://chatgpt.com/', href: 'https://chatgpt.com/', external: true },
  { name: 'Gemini', website: 'https://gemini.google.com/', href: 'https://gemini.google.com/', external: true },
  { name: 'Copilot', website: 'https://copilot.microsoft.com/', href: 'https://copilot.microsoft.com/', external: true },
  { name: 'Claude', website: 'https://claude.ai/', href: 'https://claude.ai/', external: true },
  { name: 'Grok', website: 'https://grok.com/', href: 'https://grok.com/', external: true },
  { name: 'DeepSeek', website: 'https://chat.deepseek.com/', href: 'https://chat.deepseek.com/', external: true }
];

const hiddenTickerSlugs = new Set(['agencyanalytics', 'dashthis', 'looker-studio', 'callrail', 'whatconverts']);
const tickerTools = [
  ...featuredAiTools,
  ...publishedTools
    .filter((tool) => !hiddenTickerSlugs.has(tool.slug))
    .map((tool) => ({ ...tool, href: `/tools/${tool.slug}/`, external: false }))
];

export default function HomePage() {
  const homepageCategories = homepageCategoryIds.map((categoryId) => ({
    category: getCategory(categoryId),
    tools: getToolsByCategory(categoryId)
  }));
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
      <Header heroContrast />
      <main id="main-content">
        <section className={styles.hero}>
          <GridPulse className={styles.heroPulse} />
          <div className={`${ui.shell} ${styles.heroContent}`}>
            <div className={styles.heroCopy} data-grid-avoid>
              <span className={ui.eyebrow}><span className={styles.eyebrowDot} /> Built for small marketing agencies</span>
              <h1>Choose agency software without the guesswork.</h1>
              <p>Explore practical options for client reporting, SEO audits and call tracking—organized around the work your agency actually does.</p>
              <div className={styles.heroActions}>
                <a href="#directory" className={ui.primaryButton}>Explore tools <ArrowIcon /></a>
                <Link href="/categories/" className={ui.secondaryButton}>Browse categories</Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.toolTicker} aria-label="Tools listed in the directory">
          <div className={styles.tickerViewport}>
            <div className={styles.tickerTrack}>
              {[0, 1].map((copy) => (
                <div className={styles.tickerGroup} aria-hidden={copy === 1 ? 'true' : undefined} key={copy}>
                  {tickerTools.map((tool) => (
                    <Link
                      aria-label={tool.external ? `${tool.name} official website` : undefined}
                      className={styles.tickerItem}
                      href={tool.href}
                      key={`${copy}-${tool.name}`}
                      rel={tool.external ? 'noreferrer' : undefined}
                      tabIndex={copy === 1 ? -1 : undefined}
                      target={tool.external ? '_blank' : undefined}
                    >
                      <img
                        alt=""
                        className={styles.tickerLogo}
                        draggable="false"
                        height="32"
                        loading="eager"
                        src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(tool.website)}&sz=64`}
                        width="32"
                      />
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomepageCategories categories={homepageCategories} />

      </main>
      <Footer />
    </>
  );
}

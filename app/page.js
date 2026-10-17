import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Directory from '../components/Directory';
import { ArrowIcon, ChartIcon, PhoneIcon, ReportIcon } from '../components/Icons';
import { categories, tools } from '../data/tools';
import styles from './page.module.css';
import ui from '../styles/ui.module.css';

const categoryIcons = {
  'client-reporting': ReportIcon,
  'seo-audits-rank-tracking': ChartIcon,
  'call-tracking-attribution': PhoneIcon
};

export default function HomePage() {
  return (
    <>
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
                <a href="#categories" className={ui.secondaryButton}>Browse categories</a>
              </div>
              <div className={styles.heroNote}>
                <strong>9 tools</strong><span /> <strong>3 focused categories</strong><span /> No account required
              </div>
            </div>

            <div className={styles.heroPreview} aria-label="Example software shortlist">
              <div className={styles.previewWindow}>
                <div className={styles.previewWindowTop}><i /><i /><i /><span>Reporting shortlist</span></div>
                <div className={styles.previewSearch}><span>⌕</span> client reporting</div>
                {tools.filter((tool) => tool.category === 'client-reporting').map((tool, index) => (
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

        <section className={styles.quickPaths} aria-labelledby="quick-title">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${styles.compactHeading}`}>
              <span className={ui.eyebrow}>Start with your workflow</span>
              <h2 id="quick-title">What does your agency need to do?</h2>
            </div>
            <div className={styles.quickGrid}>
              <a href="#directory" className={styles.quickCard}><ReportIcon /><span><strong>Create client reports</strong><small>Compare reporting and dashboard tools</small></span><ArrowIcon /></a>
              <a href="#directory" className={styles.quickCard}><ChartIcon /><span><strong>Audit and track SEO</strong><small>Explore crawlers and rank trackers</small></span><ArrowIcon /></a>
              <a href="#directory" className={styles.quickCard}><PhoneIcon /><span><strong>Attribute phone leads</strong><small>Find call tracking platforms</small></span><ArrowIcon /></a>
            </div>
          </div>
        </section>

        <Directory tools={tools} categories={categories} />

        <section className={styles.categoriesSection} id="categories" aria-labelledby="categories-title">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}>
              <div><span className={ui.eyebrow}>Focused collections</span><h2 id="categories-title">Browse by category</h2></div>
              <p>Each collection explains the job, the buying questions and the tools worth reviewing.</p>
            </div>
            <div className={styles.categoryGrid}>
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug];
                const count = tools.filter((tool) => tool.category === category.slug).length;
                return (
                  <Link href={`/categories/${category.slug}/`} className={`${styles.categoryCard} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`} key={category.slug}>
                    <span className={styles.categoryIcon}><Icon /></span>
                    <span className={styles.categoryCount}>{count} tools</span>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className={styles.categoryLink}>Explore category <ArrowIcon /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.methodSection} id="how-it-works" aria-labelledby="method-title">
          <div className={`${ui.shell} ${styles.methodLayout}`}>
            <div className={styles.methodIntro}>
              <span className={`${ui.eyebrow} ${styles.lightEyebrow}`}>A clearer decision process</span>
              <h2 id="method-title">Useful context, not a wall of badges.</h2>
              <p>AgencyToolGuide is being built to help owners make a shortlist, understand trade-offs and continue their research on the vendor’s official website.</p>
              <a href="#directory" className={styles.lightLink}>Start your shortlist <ArrowIcon /></a>
            </div>
            <ol className={styles.methodSteps}>
              <li><span>01</span><div><h3>Start with the job</h3><p>Choose the workflow you need to improve—not the loudest brand.</p></div></li>
              <li><span>02</span><div><h3>Review the fit</h3><p>Check the category, pricing model, summary and best-fit guidance.</p></div></li>
              <li><span>03</span><div><h3>Confirm with the vendor</h3><p>Verify current features and pricing before making a buying decision.</p></div></li>
            </ol>
          </div>
        </section>

        <section className={styles.guidesSection} id="guides" aria-labelledby="guides-title">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}>
              <div><span className={ui.eyebrow}>Buying guidance</span><h2 id="guides-title">Questions to ask before you buy</h2></div>
              <p>Short, practical checklists for agency owners evaluating a new platform.</p>
            </div>
            <div className={styles.guideGrid}>
              <article className={`${styles.guideCard} ${styles.guideFeatured}`}><span>Client reporting</span><h3>How to choose reporting software for a small agency</h3><p>Connector coverage, white-label controls, delivery workflow and cost as your client list grows.</p><small>Full guide planned</small></article>
              <article className={styles.guideCard}><span>SEO software</span><h3>What to check in a rank tracker</h3><p>Update frequency, local tracking, keyword limits and reporting options.</p><small>Checklist preview</small></article>
              <article className={styles.guideCard}><span>Call attribution</span><h3>Before adding call tracking</h3><p>Number pools, attribution setup, integrations and recording disclosures.</p><small>Checklist preview</small></article>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={`${ui.shell} ${styles.ctaCard}`}>
            <div><span className={ui.eyebrow}>Build a better shortlist</span><h2>Start with the tools that match your workflow.</h2></div>
            <a href="#directory" className={ui.primaryButton}>Explore the directory <ArrowIcon /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ToolCard from '../../../components/ToolCard';
import { ArrowIcon, ExternalIcon } from '../../../components/Icons';
import { getCategory } from '../../../data/categories';
import { getTool, getToolCategories, getToolsByCategory, publishedTools } from '../../../data/tools';
import styles from './page.module.css';
import ui from '../../../styles/ui.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Overview for Agencies`,
    description: `${tool.summary} Review the fit, pricing model and official product website.`
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const category = getCategory(tool.primaryCategoryId);
  const toolCategories = getToolCategories(tool);
  const relatedTools = getToolsByCategory(tool.primaryCategoryId).filter((item) => item.slug !== tool.slug);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><Link href={`/categories/${category.slug}/`}>{category.name}</Link><span>/</span><span>{tool.name}</span></div>
        <section className={styles.detailHero}>
          <div className={`${ui.shell} ${styles.detailHeroInner}`}>
            <div className={`${styles.detailLogo} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>{tool.initials}</div>
            <div className={styles.detailTitle}>
              <span className={ui.eyebrow}>{category.name}</span>
              <h1>{tool.name}</h1>
              <p>{tool.summary}</p>
            </div>
            <a className={`${ui.primaryButton} ${styles.detailVisit}`} href={tool.website} target="_blank" rel="noopener noreferrer">Visit official website <ExternalIcon /></a>
          </div>
        </section>

        <section className={styles.detailContent}>
          <div className={`${ui.shell} ${styles.detailGrid}`}>
            <article className={styles.detailMain}>
              <div className={styles.contentBlock}><h2>Who it may suit</h2><p>{tool.bestFor}</p></div>
              <div className={styles.contentBlock}><h2>What to review</h2><ul className={styles.checkList}>{tool.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div className={styles.noticeBox}><strong>Editorial note</strong><p>This overview is for initial software discovery. Features and pricing can change; confirm current details directly with the vendor.</p></div>
            </article>
            <aside className={styles.detailSidebar}>
              <h2>At a glance</h2>
              <dl><div><dt>Categories</dt><dd>{toolCategories.map((item, index) => <span key={item.id}>{index > 0 && ', '}<Link href={`/categories/${item.slug}/`}>{item.name}</Link></span>)}</dd></div><div><dt>Pricing model</dt><dd>{tool.pricing}</dd></div><div><dt>Listing status</dt><dd>Editorial preview</dd></div></dl>
            </aside>
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}><div><span className={ui.eyebrow}>Keep comparing</span><h2>Related tools</h2></div><Link className={styles.inlineArrow} href={`/categories/${category.slug}/`}>View category <ArrowIcon /></Link></div>
            <div className={styles.relatedGrid}>{relatedTools.map((item) => <ToolCard key={item.slug} tool={item} />)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

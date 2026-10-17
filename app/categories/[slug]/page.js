import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ToolCard from '../../../components/ToolCard';
import { ArrowIcon } from '../../../components/Icons';
import { categories, getCategory, getToolsByCategory } from '../../../data/tools';
import styles from './page.module.css';
import ui from '../../../styles/ui.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} Software for Agencies`,
    description: `${category.description} Explore an editorial preview of tools for small marketing agencies.`
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryTools = getToolsByCategory(category.slug);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><Link href="/#categories">Categories</Link><span>/</span><span>{category.name}</span></div>
        <section className={`${styles.categoryHero} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>
          <div className={`${ui.shell} ${styles.categoryHeroInner}`}>
            <span className={ui.eyebrow}>Agency software category</span>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <a href="#category-tools" className={ui.primaryButton}>View {categoryTools.length} tools <ArrowIcon /></a>
          </div>
        </section>

        <section className={styles.categoryContent} id="category-tools">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}><div><span className={ui.eyebrow}>Directory shortlist</span><h2>Tools to review</h2></div><p>Use these summaries to form a shortlist, then confirm current capabilities and pricing with each vendor.</p></div>
            <div className={styles.toolGrid}>{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
          </div>
        </section>

        <section className={styles.buyingQuestions}>
          <div className={`${ui.shell} ${styles.buyingCard}`}>
            <div><span className={ui.eyebrow}>Before you decide</span><h2>Three useful buying questions</h2></div>
            <ol><li><span>01</span>Does the workflow fit how your team already delivers client work?</li><li><span>02</span>Which limits or add-ons will affect the real monthly cost?</li><li><span>03</span>Can your team test the product with realistic client data before committing?</li></ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

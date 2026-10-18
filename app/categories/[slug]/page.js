import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoryDirectory from '../../../components/CategoryDirectory';
import { ArrowIcon } from '../../../components/Icons';
import { categoryAliases, mainCategories, resolveCategorySlug } from '../../../data/categories';
import { getToolsByCategory } from '../../../data/tools';
import styles from './page.module.css';
import ui from '../../../styles/ui.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return [...mainCategories.map((category) => category.slug), ...Object.keys(categoryAliases)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { category, isLegacy } = resolveCategorySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} AI Tools`,
    description: `${category.description} Compare tools, pricing and workflow fit.`,
    alternates: { canonical: `/categories/${category.slug}/` },
    openGraph: { title: `${category.name} AI Tools`, description: `${category.description} Compare tools, pricing and workflow fit.`, url: `/categories/${category.slug}/` },
    ...(isLegacy ? { robots: { index: false, follow: true } } : {})
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const { category, isLegacy } = resolveCategorySlug(slug);
  if (!category) notFound();
  const categoryTools = getToolsByCategory(category.id);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><Link href="/categories/">Categories</Link><span>/</span><span>{category.name}</span></div>
        {isLegacy && <div className={`${ui.shell} ${styles.legacyNotice}`}>This category has a new home. <Link href={`/categories/${category.slug}/`}>Use the current {category.name} page</Link>.</div>}
        <section className={`${styles.categoryHero} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>
          <div className={`${ui.shell} ${styles.categoryHeroInner}`}>
            <span className={ui.eyebrow}>AI software category</span>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <a href="#category-tools" className={ui.primaryButton}>View {categoryTools.length} tools <ArrowIcon /></a>
          </div>
        </section>
        <section className={styles.categoryContent} id="category-tools">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}><div><span className={ui.eyebrow}>Directory results</span><h2>Tools to review</h2></div><p>Search this category, filter by subcategory and pricing, then confirm current details with the vendor.</p></div>
            <CategoryDirectory tools={categoryTools} subcategories={category.subcategories} />
          </div>
        </section>
        <section className={styles.buyingQuestions}><div className={`${ui.shell} ${styles.buyingCard}`}><div><span className={ui.eyebrow}>Before you decide</span><h2>Three useful buying questions</h2></div><ol><li><span>01</span>Does the workflow fit how your team already delivers client work?</li><li><span>02</span>Which limits or add-ons affect the real monthly cost?</li><li><span>03</span>Can your team test the product with realistic data before committing?</li></ol></div></section>
      </main>
      <Footer />
    </>
  );
}

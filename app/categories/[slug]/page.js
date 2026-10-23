import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoryDirectory from '../../../components/CategoryDirectory';
import { ArrowIcon } from '../../../components/Icons';
import { categoryAliases } from '../../../data/categories';
import { getCategorySeoDescription, getCategorySeoTitle } from '../../../lib/category-seo';
import { resolvePublicCategorySlug } from '../../../lib/public-categories';
import { getPublicToolsByCategory } from '../../../lib/public-tools';
import styles from './page.module.css';
import ui from '../../../styles/ui.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { category, isLegacy } = await resolvePublicCategorySlug(slug, categoryAliases);
  if (!category) return {};
  const title = getCategorySeoTitle(category.name);
  const description = getCategorySeoDescription(category.name);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/categories/${category.slug}/` },
    openGraph: { title, description, url: `/categories/${category.slug}/` },
    ...(isLegacy ? { robots: { index: false, follow: true } } : {})
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const { category, isLegacy } = await resolvePublicCategorySlug(slug, categoryAliases);
  if (!category) notFound();
  const categoryTools = await getPublicToolsByCategory(category.id);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><Link href="/categories/">Categories</Link><span>/</span><span>{category.name}</span></div>
        {isLegacy && <div className={`${ui.shell} ${styles.legacyNotice}`}>This category has a new home. <Link href={`/categories/${category.slug}/`}>Use the current {category.name} page</Link>.</div>}
        <section className={`${styles.categoryHero} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>
          <div className={`${ui.shell} ${styles.categoryHeroInner}`}>
            <span className={ui.eyebrow}>AI tool category</span>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <a href="#category-tools" className={`${ui.primaryButton} ${styles.categoryCta}`}>View {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} <ArrowIcon /></a>
          </div>
        </section>
        <section className={styles.categoryContent} id="category-tools">
          <div className={ui.shell}>
            <div className={`${ui.sectionHeading} ${ui.splitHeading}`}><div><h2>Tools to review</h2></div><p>Search this category, filter by subcategory and pricing, then confirm current details with the vendor.</p></div>
            <CategoryDirectory tools={categoryTools} subcategories={category.subcategories} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

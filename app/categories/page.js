import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryBrowser from '../../components/CategoryBrowser';
import { getCategorySearchText, mainCategories } from '../../data/categories';
import { getCategoryToolCount } from '../../data/tools';
import { getSubcategoryToolCount } from '../../lib/category-utils';
import styles from './page.module.css';
import ui from '../../styles/ui.module.css';

export const metadata = {
  title: 'AI Tool Categories',
  description: 'Browse populated AI software categories and find tools by workflow.',
  alternates: { canonical: '/categories/' },
  openGraph: { title: 'AI Tool Categories', description: 'Browse AI software categories and find tools by workflow.', url: '/categories/' }
};

export default function CategoriesPage() {
  const categories = mainCategories.map((category, index) => ({
    ...category,
    order: index + 1,
    count: getCategoryToolCount(category.id),
    searchText: getCategorySearchText(category),
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      count: getSubcategoryToolCount(subcategory.id),
      searchText: `${subcategory.name} ${subcategory.description} ${subcategory.searchSynonyms.join(' ')}`.toLowerCase()
    }))
  }));

  return (
    <>
      <Header />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={`${ui.shell} ${styles.heroInner}`}>
            <span className={ui.eyebrow}>Software taxonomy</span>
            <h1 id="all-categories-title">Explore AI tool categories</h1>
            <p>Browse every main category and explore the focused subcategories underneath it.</p>
          </div>
        </section>
        <CategoryBrowser categories={categories} />
      </main>
      <Footer />
    </>
  );
}

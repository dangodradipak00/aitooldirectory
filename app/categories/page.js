import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryBrowser from '../../components/CategoryBrowser';
import { getCategorySearchText } from '../../data/categories';
import { getCategoryToolCount } from '../../data/tools';
import { getSubcategoryToolCount } from '../../lib/category-utils';
import { getPublicCategories } from '../../lib/public-categories';
import styles from './page.module.css';
import ui from '../../styles/ui.module.css';

export const metadata = {
  title: { absolute: 'List of AI Categories - Find the Best Tools | FreemiumAITools' },
  description: 'Browse every category on FreemiumAITools and find the best listings sorted by topic. Compare options, read details and discover what you need much faster.',
  alternates: { canonical: '/categories/' },
  openGraph: { title: 'List of AI Categories - Find the Best Tools | FreemiumAITools', description: 'Browse every category on FreemiumAITools and find the best listings sorted by topic. Compare options, read details and discover what you need much faster.', url: '/categories/' }
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const publicCategories = await getPublicCategories();
  const categories = publicCategories.map((category, index) => ({
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

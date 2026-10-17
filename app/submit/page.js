import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolSubmissionForm from '../../components/ToolSubmissionForm';
import { getCategorySearchText, mainCategories } from '../../data/categories';
import styles from './page.module.css';
import ui from '../../styles/ui.module.css';

export const metadata = {
  title: 'Submit an AI Tool',
  description: 'Preview the AI tool submission and category selection process.',
  robots: { index: false, follow: true }
};

export default function SubmitPage() {
  const categories = mainCategories.filter((category) => category.classificationAvailable).map((category) => ({ ...category, searchText: getCategorySearchText(category) }));
  return (
    <>
      <Header />
      <main id="main-content">
        <section className={styles.hero}><div className={`${ui.shell} ${styles.heroInner}`}><span className={ui.eyebrow}>Submission preview</span><h1>Submit an AI tool</h1><p>Describe the tool and classify it using one primary category, up to two secondary categories and relevant subcategories.</p></div></section>
        <section className={styles.content}><div className={`${ui.shell} ${styles.formWrap}`}><ToolSubmissionForm categories={categories} /></div></section>
      </main>
      <Footer />
    </>
  );
}

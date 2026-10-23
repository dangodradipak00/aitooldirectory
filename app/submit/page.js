import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolSubmissionForm from '../../components/ToolSubmissionForm';
import { getPublicCategories } from '../../lib/public-categories';
import styles from './page.module.css';
import ui from '../../styles/ui.module.css';

export const metadata = {
  title: { absolute: 'Submit Your Tool or Website | FreemiumAITools' },
  description: 'Submit your listing to FreemiumAITools and get discovered by more people. Fill out the simple form and our team will review your submission and reply quickly.',
  alternates: { canonical: '/submit/' }
};

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
  const categories = (await getPublicCategories()).map((category) => ({
    ...category,
    searchText: `${category.name} ${category.description} ${category.subcategories.map((item) => item.name).join(' ')}`.toLowerCase()
  }));
  return (
    <>
      <Header />
      <main id="main-content">
        <section className={styles.hero}><div className={`${ui.shell} ${styles.heroInner}`}><span className={ui.eyebrow}>Editorial submission request</span><h1>Submit an AI tool</h1><p>Send the complete tool profile once. We review the information, contact you by email and confirm manual payment before publication.</p></div></section>
        <section className={styles.content}><div className={`${ui.shell} ${styles.formWrap}`}>
          <div className={styles.offerNotice}>
            <div><span>Starting at $9</span><h2>What the submission fee covers</h2></div>
            <ul><li>Editorial review of supplied tool information</li><li>A directory profile if the tool is accepted</li><li>Clear sponsored disclosure when payment affects placement</li><li>No guaranteed positive coverage, traffic or search ranking</li></ul>
            <p>No payment is collected through this form. Accepted requests receive the final deliverables and manual payment terms by email before work starts. Read the <a href="/refund-policy/">refund policy</a>.</p>
          </div>
          <ToolSubmissionForm categories={categories} />
        </div></section>
      </main>
      <Footer />
    </>
  );
}

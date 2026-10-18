import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolSubmissionForm from '../../components/ToolSubmissionForm';
import { getCategorySearchText, mainCategories } from '../../data/categories';
import styles from './page.module.css';
import ui from '../../styles/ui.module.css';

export const metadata = {
  title: 'Submit an AI Tool',
  description: 'Review AgencyToolGuide submission requirements, commercial disclosures and category options before requesting an editorial tool profile.',
  alternates: { canonical: '/submit/' }
};

export default function SubmitPage() {
  const categories = mainCategories.filter((category) => category.classificationAvailable).map((category) => ({ ...category, searchText: getCategorySearchText(category) }));
  return (
    <>
      <Header />
      <main id="main-content">
        <section className={styles.hero}><div className={`${ui.shell} ${styles.heroInner}`}><span className={ui.eyebrow}>Editorial submission request</span><h1>Submit an AI tool</h1><p>Review the requirements, prepare your classification and email a submission request. We confirm eligibility, scope and payment before editorial work begins.</p></div></section>
        <section className={styles.content}><div className={`${ui.shell} ${styles.formWrap}`}>
          <div className={styles.offerNotice}>
            <div><span>Starting at $9</span><h2>What the submission fee covers</h2></div>
            <ul><li>Editorial review of supplied tool information</li><li>A directory profile if the tool is accepted</li><li>Clear sponsored disclosure when payment affects placement</li><li>No guaranteed positive coverage, traffic or search ranking</li></ul>
            <p>No payment is collected through this classification worksheet. Accepted requests receive the final deliverables and payment terms before work starts. Read the <a href="/refund-policy/">refund policy</a> and <a href="/advertising-disclosure/">advertising disclosure</a>.</p>
          </div>
          <ToolSubmissionForm categories={categories} />
        </div></section>
      </main>
      <Footer />
    </>
  );
}

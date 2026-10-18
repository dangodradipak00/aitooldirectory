import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './not-found.module.css';
import ui from '../styles/ui.module.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className={`${styles.notFound} ${ui.shell}`}>
        <span className={ui.eyebrow}>404</span>
        <h1>This page could not be found.</h1>
        <p>The page may have moved, or the tool is not part of the published directory.</p>
        <Link href="/" className={ui.primaryButton}>Return to the directory</Link>
      </main>
      <Footer />
    </>
  );
}

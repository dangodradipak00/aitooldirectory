import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './not-found.module.css';
import ui from '../styles/ui.module.css';

export const metadata = {
  title: '404',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <section className={`${styles.notFound} ${ui.shell}`}>
          <div className={styles.card}>
            <span className={styles.glow} aria-hidden="true" />
            <div className={styles.errorCode} aria-hidden="true">
              <span>4</span>
              <span className={styles.zero}>0</span>
              <span>4</span>
            </div>

            <div className={styles.content}>
              <span className={ui.eyebrow}>Error 404</span>
              <h1>Looks like this page wandered off.</h1>
              <p>
                The link may be outdated or the address may have been typed incorrectly.
                Let&apos;s get you back to exploring useful AI tools.
              </p>
              <div className={styles.actions}>
                <Link href="/" className={ui.primaryButton}>Go to homepage <span aria-hidden="true">→</span></Link>
                <Link href="/categories/" className={ui.secondaryButton}>Browse categories</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

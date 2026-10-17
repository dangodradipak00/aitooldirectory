import Link from 'next/link';
import { categories } from '../data/tools';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={`${styles.shell} ${styles.footerGrid}`}>
        <div>
          <Link href="/" className={`${styles.brand} ${styles.footerBrand}`}>
            <span className={styles.brandMark}>A</span>
            <span>AgencyTool<span>Guide</span></span>
          </Link>
          <p>Practical software discovery for small SEO and digital marketing agencies.</p>
        </div>
        <div>
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}><Link href={`/categories/${category.slug}/`}>{category.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Directory</h2>
          <ul>
            <li><Link href="/#directory">Find tools</Link></li>
            <li><Link href="/#how-it-works">Editorial approach</Link></li>
            <li><Link href="/#guides">Buying guides</Link></li>
          </ul>
        </div>
      </div>
      <div className={`${styles.shell} ${styles.footerBottom}`}>
        <p>Preview directory. Confirm current features and pricing on each vendor’s official website.</p>
        <p>© {new Date().getFullYear()} AgencyToolGuide</p>
      </div>
    </footer>
  );
}

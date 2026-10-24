import Link from 'next/link';
import { homepageCategoryIds } from '../data/categories';
import { getPublicCategories } from '../lib/public-categories';
import styles from './Footer.module.css';
import ui from '../styles/ui.module.css';

export default async function Footer() {
  const publicCategories = await getPublicCategories();
  const categoriesById = new Map(publicCategories.map((category) => [category.id, category]));
  const categories = homepageCategoryIds.slice(0, 10).map((id) => categoriesById.get(id)).filter(Boolean);
  return (
    <footer className={styles.siteFooter}>
      <div className={`${styles.shell} ${styles.footerCtaWrap}`}>
        <div className={styles.footerCta}>
          <h2>Put your tool in front of people already looking for it.</h2>
          <p>Request an editorial tool profile from $9. Every submission is reviewed before payment, commercial relationships are disclosed and no traffic or ranking is guaranteed.</p>
          <Link className={ui.primaryButton} href="/submit/">View submission process <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className={`${styles.shell} ${styles.footerGrid}`}>
        <div>
          <Link href="/" className={`${styles.brand} ${styles.footerBrand}`}>
            <span className={styles.brandMark}>F</span>
            <span>FreemiumAI<span>Tools</span></span>
          </Link>
          <p>Practical AI tool reviews for business owners and founders.</p>
          <div className={styles.footerContact}>
            <span>Questions or listing enquiries?</span>
            <a href="mailto:hello@freemiumaitools.com">hello@freemiumaitools.com</a>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} FreemiumAITools</p>
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
            <li><Link href="/categories/">All categories</Link></li>
            <li><Link href="/blog/">Blog</Link></li>
            <li><Link href="/submit/">Submit a tool</Link></li>
          </ul>
        </div>
        <div>
          <h2>Company &amp; Legal</h2>
          <ul>
            <li><Link href="/about/">About us</Link></li>
            <li><Link href="/authors/editorial-team/">Editorial team</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/privacy-policy/">Privacy policy</Link></li>
            <li><Link href="/cookie-policy/">Cookie policy</Link></li>
            <li><Link href="/terms-and-conditions/">Terms &amp; conditions</Link></li>
            <li><Link href="/refund-policy/">Refund policy</Link></li>
            <li><Link href="/disclaimer/">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className={`${styles.shell} ${styles.footerWordmark}`} aria-hidden="true">FreemiumAITools</div>
    </footer>
  );
}

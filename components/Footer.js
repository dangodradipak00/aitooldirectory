import Link from 'next/link';
import { getCategory, homepageCategoryIds } from '../data/categories';
import styles from './Footer.module.css';

export default function Footer() {
  const categories = homepageCategoryIds.slice(0, 10).map(getCategory).filter(Boolean);
  return (
    <footer className={styles.siteFooter}>
      <div className={`${styles.shell} ${styles.footerCtaWrap}`}>
        <div className={styles.footerCta}>
          <span className={styles.ctaEyebrow}>Built for growing software products</span>
          <h2>Put your tool in front of people already looking for it.</h2>
          <p>Request an editorial tool profile from $9. Every submission is reviewed before payment, commercial relationships are disclosed and no traffic or ranking is guaranteed.</p>
          <Link className={styles.ctaButton} href="/submit/">View submission process <span aria-hidden="true">→</span></Link>
          <small>Clear deliverables. Editorial review. Transparent links.</small>
        </div>
      </div>
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
            <li><Link href="/categories/">All categories</Link></li>
            <li><Link href="/submit/">Submit a tool</Link></li>
            <li><Link href="/editorial-policy/">Editorial approach</Link></li>
            <li><Link href="/#guides">Buying guides</Link></li>
          </ul>
        </div>
        <div>
          <h2>Company &amp; Legal</h2>
          <ul>
            <li><Link href="/about/">About us</Link></li>
            <li><Link href="/authors/editorial-team/">Editorial team</Link></li>
            <li><Link href="/editorial-policy/">Editorial policy</Link></li>
            <li><Link href="/advertising-disclosure/">Advertising disclosure</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/privacy-policy/">Privacy policy</Link></li>
            <li><Link href="/cookie-policy/">Cookie policy</Link></li>
            <li><Link href="/terms-and-conditions/">Terms &amp; conditions</Link></li>
            <li><Link href="/refund-policy/">Refund policy</Link></li>
            <li><Link href="/disclaimer/">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className={`${styles.shell} ${styles.footerBottom}`}>
        <p>Independent software directory. Confirm current features and pricing on each vendor’s official website.</p>
        <p>© {new Date().getFullYear()} AgencyToolGuide</p>
      </div>
      <div className={`${styles.shell} ${styles.footerWordmark}`} aria-hidden="true">AgencyToolGuide</div>
    </footer>
  );
}

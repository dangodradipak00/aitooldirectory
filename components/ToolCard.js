import Link from 'next/link';
import { BookmarkIcon, ExternalIcon } from './Icons';
import { getCategory } from '../data/categories';
import { getVendorLinkRel, getVendorTrackingUrl } from '../lib/link-utils';
import styles from './ToolCard.module.css';

export default function ToolCard({ tool, saved = false, onSave }) {
  const category = getCategory(tool.primaryCategoryId);
  return (
    <article className={styles.toolCard}>
      <div className={styles.toolCardTop}>
        <div className={`${styles.toolLogo} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>
          {tool.logoUrl ? <img src={tool.logoUrl} alt={`${tool.name} logo`} /> : tool.initials}
        </div>
        <div className={styles.toolTitleWrap}>
          <h3><Link href={`/tools/${tool.slug}/`}>{tool.name}</Link></h3>
          <Link href={`/categories/${category.slug}/`} className={styles.toolCategory}>{category.name}</Link>
        </div>
        {onSave && (
          <button className={`${styles.cardSave} ${saved ? styles.saved : ''}`} type="button" onClick={() => onSave(tool.slug)} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${tool.name}`}>
            <BookmarkIcon filled={saved} />
          </button>
        )}
      </div>
      <p className={styles.toolSummary}>{tool.summary}</p>
      <div className={styles.toolCardBottom}>
        <span className={`${styles.priceTag} ${tool.pricing === 'Paid' ? styles.pricePaid : styles.priceFree}`}>{tool.pricing}</span>
        <div className={styles.cardLinks}>
          <Link href={`/tools/${tool.slug}/`} className={styles.detailsLink}>Details</Link>
          <a href={getVendorTrackingUrl(tool)} target="_blank" rel={getVendorLinkRel(tool)} className={styles.visitLink}>Visit <ExternalIcon /></a>
        </div>
      </div>
    </article>
  );
}

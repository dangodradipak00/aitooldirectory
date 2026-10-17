import Link from 'next/link';
import { ArrowIcon } from './Icons';
import styles from './CategoryCard.module.css';

export default function CategoryCard({ category, count }) {
  return (
    <Link href={`/categories/${category.slug}/`} className={`${styles.card} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>
      <span className={styles.icon} aria-hidden="true">{category.name.slice(0, 1)}</span>
      <span className={styles.count}>{count} {count === 1 ? 'tool' : 'tools'}</span>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span className={styles.link}>Explore category <ArrowIcon /></span>
    </Link>
  );
}

'use client';

import type { MarkdownHeading } from '@/lib/markdown-headings';
import styles from '@/app/blog/blog.module.css';

type BlogTableOfContentsProps = {
  headings: MarkdownHeading[];
};

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  if (headings.length === 0) {
    return <p className={styles.emptyRailText}>Article sections will appear here.</p>;
  }

  return (
    <ol className={styles.tocList}>
      {headings.map((heading) => (
        <li className={heading.level === 3 ? styles.tocSubitem : undefined} key={heading.id}>
          <button type="button" onClick={() => scrollToHeading(heading.id)}>
            {heading.text}
          </button>
        </li>
      ))}
    </ol>
  );
}

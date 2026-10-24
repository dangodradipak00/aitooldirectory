import Link from 'next/link';
import { ArrowIcon } from './Icons';
import CategoryIcon, { getCategoryIconStyle } from './CategoryIcon';
import styles from './HomepageCategories.module.css';
import ui from '../styles/ui.module.css';

export default function HomepageCategories({ categories }) {
  return (
    <section className={styles.section} id="directory" aria-labelledby="homepage-categories-title">
      <div className={ui.shell}>
        <div className={styles.divider}><span>Popular AI categories</span></div>
        <div className={`${ui.sectionHeading} ${styles.heading}`}>
          <h2 id="homepage-categories-title">Find the right category for the job</h2>
          <p>Start with a category, review up to ten matching tools and open the full category when you need more.</p>
        </div>

        <div className={styles.grid}>
          {categories.map(({ category, tools }) => (
            <article className={`${styles.card} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`} key={category.id}>
              <header className={styles.cardHeader}>
                <span className={styles.cardIcon} style={getCategoryIconStyle(category)}><CategoryIcon category={category} /></span>
                <h3>{category.name}</h3>
                <span className={styles.total}>{tools.length} {tools.length === 1 ? 'tool' : 'tools'}</span>
              </header>

              {tools.length ? (
                <ol className={styles.toolList}>
                  {tools.slice(0, 10).map((tool) => (
                    <li key={tool.slug}>
                      <Link href={`/tools/${tool.slug}/`}>
                        <span className={styles.logo} aria-hidden="true">
                          {tool.logoUrl ? <img src={tool.logoUrl} alt="" /> : tool.initials}
                        </span>
                        <span>{tool.name}</span>
                        <span className={styles.rowArrow} aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.empty}><span>No published tools yet</span><small>This category is ready for future listings.</small></div>
              )}

              <Link className={styles.cardFooter} href={`/categories/${category.slug}/`}>
                View category <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.allCategories}>
          <Link className={ui.primaryButton} href="/categories/">View all categories <ArrowIcon /></Link>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import MarkdownContent from '@/components/MarkdownContent';
import { ArrowIcon } from '@/components/Icons';
import { getPublishedBlog } from '@/lib/public-blogs';
import { absoluteUrl, editorialTeamName, siteName } from '@/lib/site';
import styles from '../blog.module.css';
import ui from '@/styles/ui.module.css';

export const dynamic = 'force-dynamic';

function postDate(post: { publishedAt: Date | null; createdAt: Date }) {
  return post.publishedAt || post.createdAt;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, url: `/blog/${post.slug}/`, type: 'article', ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}) }
  };
}

export default async function BlogArticlePage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) notFound();
  const date = postDate(post);
  const artworkTone = post.slug.includes('workflow') ? 1 : post.slug.includes('pricing') ? 2 : 0;
  const articleUrl = absoluteUrl(`/blog/${post.slug}/`);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: date.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: articleUrl,
    author: { '@type': 'Organization', name: editorialTeamName },
    publisher: { '@type': 'Organization', name: siteName, url: absoluteUrl('/') },
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {})
  };

  return <>
    <JsonLd data={schema} />
    <Header />
    <main className={styles.articlePage} id="main-content">
      <article>
        <header className={styles.articleHero}>
          <div className={`${ui.shell} ${styles.articleHeroInner}`}>
            <Link className={styles.backLink} href="/blog/"><span aria-hidden="true">←</span> All blogs</Link>
            <h1>{post.title}</h1>
          </div>
        </header>
        <div className={`${ui.shell} ${styles.articleFrame}`}>
          <div className={styles.articleCover}>
            {post.coverImageUrl ? <img alt="" src={post.coverImageUrl} /> : <div className={styles.articleArtwork} data-tone={artworkTone}>
              <span className={styles.artworkOrbOne} />
              <span className={styles.artworkOrbTwo} />
              <span className={styles.artworkMesh} />
              <strong>AgencyToolGuide</strong>
            </div>}
          </div>
          <div className={styles.articleLayout}>
            <div className={styles.articleDates}>
              <div className={styles.articleDateItem}>
                <svg viewBox="0 0 24 24" className={styles.dateIcon} aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div className={styles.articleDateText}>
                  <span className={styles.dateLabel}>Published</span>
                  <time dateTime={date.toISOString()} className={styles.dateValue}>{formatDate(date)}</time>
                </div>
              </div>

              <div className={styles.articleDateDivider} aria-hidden="true" />

              <div className={styles.articleDateItem}>
                <svg viewBox="0 0 24 24" className={styles.dateIcon} aria-hidden="true">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <div className={styles.articleDateText}>
                  <span className={styles.dateLabel}>Last updated</span>
                  <time dateTime={post.updatedAt.toISOString()} className={styles.dateValue}>{formatDate(post.updatedAt)}</time>
                </div>
              </div>
            </div>

            <MarkdownContent className={styles.articleContent} content={post.content} />

            <section className={styles.authorCard} aria-labelledby="author-heading">
              <div className={styles.authorAvatar} aria-hidden="true">
                <span>ATG</span>
              </div>
              <div className={styles.authorBody}>
                <div className={styles.authorHeader}>
                  <span className={styles.authorEyebrow}>Written by</span>
                  <h3 id="author-heading" className={styles.authorName}>
                    <Link href="/authors/editorial-team/">{editorialTeamName}</Link>
                  </h3>
                </div>
                <p className={styles.authorBio}>
                  The editorial team researches, structures and maintains AgencyToolGuide’s software profiles, category pages and practical buying guidance.
                </p>
                <Link href="/authors/editorial-team/" className={styles.authorLink}>
                  <span>About our editorial standards</span>
                  <ArrowIcon />
                </Link>
              </div>
            </section>

            <aside className={styles.articleEndCta}>
              <div><span>Keep exploring</span><h2>Find the right tool for your next workflow.</h2></div>
              <Link href="/categories/">Explore categories <ArrowIcon /></Link>
            </aside>
          </div>
        </div>
      </article>
    </main>
    <Footer />
  </>;
}

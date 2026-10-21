import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import MarkdownContent from '@/components/MarkdownContent';
import BlogTableOfContents from '@/components/BlogTableOfContents';
import { ArrowIcon } from '@/components/Icons';
import { getPublishedBlog, getPublishedBlogs } from '@/lib/public-blogs';
import { extractMarkdownHeadings } from '@/lib/markdown-headings';
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
    description: post.seoDescription || post.title,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.title, url: `/blog/${post.slug}/`, type: 'article', ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}) }
  };
}

export default async function BlogArticlePage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPublishedBlog(slug), getPublishedBlogs()]);
  if (!post) notFound();
  const date = postDate(post);
  const faqs = post.faqs || [];
  const headings = [
    ...extractMarkdownHeadings(post.content).filter((heading) => heading.level === 2),
    ...(faqs.length ? [{ level: 2 as const, text: 'Frequently asked questions', id: 'frequently-asked-questions' }] : [])
  ];
  const latestPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const artworkTone = post.slug.includes('workflow') ? 1 : post.slug.includes('pricing') ? 2 : 0;
  const articleUrl = absoluteUrl(`/blog/${post.slug}/`);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.title,
    datePublished: date.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: articleUrl,
    author: { '@type': 'Organization', name: editorialTeamName },
    publisher: { '@type': 'Organization', name: siteName, url: absoluteUrl('/') },
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {})
  };

  return <>
    <JsonLd data={schema} />
    {faqs.length ? <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    }} /> : null}
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
          <div className={styles.articleReadingGrid}>
              <aside className={styles.tocSidebar}>
                <nav className={styles.stickyRail} aria-label="Table of contents">
                  <h2>Table of contents</h2>
                  <BlogTableOfContents headings={headings} />
                </nav>
            </aside>

            <div className={styles.articleLayout}>
            <div className={styles.articleDates}>
              <div className={styles.articleDateItem}>
                <div className={styles.articleDateText}>
                  <span className={styles.dateLabel}>Published</span>
                  <time dateTime={date.toISOString()} className={styles.dateValue}>{formatDate(date)}</time>
                </div>
              </div>

              <div className={styles.articleDateDivider} aria-hidden="true" />

              <div className={styles.articleDateItem}>
                <div className={styles.articleDateText}>
                  <span className={styles.dateLabel}>Last updated</span>
                  <time dateTime={post.updatedAt.toISOString()} className={styles.dateValue}>{formatDate(post.updatedAt)}</time>
                </div>
              </div>
            </div>

            <MarkdownContent className={styles.articleContent} content={post.content} />

            {faqs.length ? <section className={styles.articleFaqs} id="frequently-asked-questions" aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently asked questions</h2>
              <div className={styles.articleFaqList}>
                {faqs.map((faq, index) => <details key={`${faq.question}-${index}`}>
                  <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                  <p>{faq.answer}</p>
                </details>)}
              </div>
            </section> : null}

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
            </div>

          </div>
        </div>
      </article>

      {latestPosts.length > 0 ? <section className={`${ui.shell} ${styles.relatedBlogs}`} aria-labelledby="related-blogs-heading">
        <div className={styles.relatedBlogsHeader}>
          <h2 id="related-blogs-heading">Related blogs</h2>
          <p>Discover more practical guides and ideas to help your team choose and use AI tools with confidence.</p>
        </div>
        <div className={styles.relatedBlogsGrid}>
          {latestPosts.map((item, index) => <article className={styles.relatedBlogCard} key={item.id}>
            <Link className={styles.relatedBlogMedia} data-tone={index % 3} href={`/blog/${item.slug}/`} aria-label={item.title}>
              {item.coverImageUrl ? <img alt="" src={item.coverImageUrl} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
            </Link>
            <div className={styles.relatedBlogBody}>
              <time dateTime={postDate(item).toISOString()}>{formatDate(postDate(item))}</time>
              <h3><Link href={`/blog/${item.slug}/`}>{item.title}</Link></h3>
            </div>
          </article>)}
        </div>
      </section> : null}

    </main>
    <Footer />
  </>;
}

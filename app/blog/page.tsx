import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowIcon } from '@/components/Icons';
import { getPublishedBlogs } from '@/lib/public-blogs';
import styles from './blog.module.css';
import ui from '@/styles/ui.module.css';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'AI Tool Insights & Guides',
  description: 'Practical guides, comparisons and insights for choosing AI and agency software.',
  alternates: { canonical: '/blog/' },
  openGraph: { title: 'AI Tool Insights & Guides', description: 'Practical software research for modern agency teams.', url: '/blog/' }
};

function publishedDate(post: { publishedAt: Date | null; createdAt: Date }) {
  return post.publishedAt || post.createdAt;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
}

type BlogPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getPublishedBlogs();
  const rawQuery = (await searchParams).q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || '').trim();
  const normalizedQuery = query.toLowerCase();
  const visiblePosts = normalizedQuery
    ? posts.filter((post) => `${post.title} ${post.excerpt}`.toLowerCase().includes(normalizedQuery))
    : posts;

  return <>
    <Header />
    <main id="main-content">
      <section className={styles.hero}>
        <div className={`${ui.shell} ${styles.heroInner}`}>
          <h1>Our Blogs</h1>
          <p>Practical guides, honest comparisons and useful ideas for choosing AI and agency tools with confidence.</p>
        </div>
      </section>

      <section className={`${ui.shell} ${styles.blogSection}`}>
        {posts.length > 0 ? <>
          <div className={styles.latestHeader}>
            <form className={styles.searchForm} action="/blog/" method="get" role="search">
              <label className={styles.visuallyHidden} htmlFor="blog-search">Search blogs</label>
              <input defaultValue={query} id="blog-search" name="q" placeholder="Search blogs..." type="search" />
              <button type="submit">Search</button>
            </form>
          </div>
          {visiblePosts.length > 0 ? <div className={styles.postGrid}>{visiblePosts.map((post, index) => <article className={styles.postCard} key={post.id}>
            <Link className={styles.cardMedia} data-tone={index % 3} href={`/blog/${post.slug}/`}>
              {post.coverImageUrl ? <img alt="" src={post.coverImageUrl} /> : <div className={styles.cardArtwork}><span>{String(index + 1).padStart(2, '0')}</span></div>}
            </Link>
            <div className={styles.cardBody}>
              <span className={styles.postMeta}>{formatDate(publishedDate(post))}</span>
              <h2><Link href={`/blog/${post.slug}/`}>{post.title}</Link></h2>
            </div>
          </article>)}</div> : <div className={styles.noResults}><h3>No blogs found</h3><p>Try a different search term.</p><Link href="/blog/">Clear search</Link></div>}
        </> : <div className={styles.emptyState}>
          <span className={styles.emptyMark}>A</span>
          <span className={ui.eyebrow}>Editorial desk</span>
          <h2>Useful ideas are on the way.</h2>
          <p>We are preparing practical guides for choosing and using AI software. In the meantime, explore the directory.</p>
          <Link className={ui.primaryButton} href="/categories/">Browse categories <ArrowIcon /></Link>
        </div>}
      </section>
    </main>
    <Footer />
  </>;
}

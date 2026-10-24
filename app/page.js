import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import HomepageCategories from '../components/HomepageCategories';
import HomepageContent from '../components/HomepageContent';
import { ArrowIcon } from '../components/Icons';
import { GridPulse } from '../components/ui/grid-pulse';
import { homepageCategoryIds } from '../data/categories';
import { publishedTools } from '../data/tools';
import { getPublicCategories } from '../lib/public-categories';
import { getPublicTools } from '../lib/public-tools';
import { getPublishedBlogs } from '../lib/public-blogs';
import { homepageFaqs, reviewer } from '../lib/homepage-config';
import styles from './page.module.css';
import ui from '../styles/ui.module.css';
import { absoluteUrl, siteName } from '../lib/site';

export const metadata = {
  title: { absolute: 'Free AI Tools Directory and Tool Reviews | FreemiumAItools' },
  description: 'Discover free AI tools in our AI directory. Read honest tool reviews, compare features and pricing across 28 categories and find the best AI tools for you.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free AI Tools Directory and Tool Reviews | FreemiumAItools',
    description: 'Discover free AI tools in our AI directory. Read honest tool reviews, compare features and pricing across 28 categories and find the best AI tools for you.',
    url: '/',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Free AI Tools Directory and Tool Reviews | FreemiumAItools',
    description: 'Discover free AI tools in our AI directory. Read honest tool reviews, compare features and pricing across 28 categories and find the best AI tools for you.'
  }
};

const featuredAiTools = [
  { name: 'ChatGPT', website: 'https://chatgpt.com/', href: 'https://chatgpt.com/', external: true },
  { name: 'Gemini', website: 'https://gemini.google.com/', href: 'https://gemini.google.com/', external: true },
  { name: 'Copilot', website: 'https://copilot.microsoft.com/', href: 'https://copilot.microsoft.com/', external: true },
  { name: 'Claude', website: 'https://claude.ai/', href: 'https://claude.ai/', external: true },
  { name: 'Grok', website: 'https://grok.com/', href: 'https://grok.com/', external: true },
  { name: 'DeepSeek', website: 'https://chat.deepseek.com/', href: 'https://chat.deepseek.com/', external: true }
];

const tickerTools = [
  ...featuredAiTools,
  ...publishedTools
    .map((tool) => ({ ...tool, href: `/tools/${tool.slug}/`, external: false }))
];

export const dynamic = 'force-dynamic';

function blogExcerpt(post) {
  if (post.seoDescription) return post.seoDescription;
  return post.content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

export default async function HomePage() {
  const [publicCategories, publicTools, publishedBlogs] = await Promise.all([
    getPublicCategories(),
    getPublicTools(),
    getPublishedBlogs()
  ]);
  const categoriesById = new Map(publicCategories.map((category) => [category.id, category]));
  const homepageCategories = homepageCategoryIds.filter((categoryId) => categoriesById.has(categoryId)).map((categoryId) => ({
    category: categoriesById.get(categoryId),
    tools: publicTools.filter((tool) => tool.primaryCategoryId === categoryId || tool.secondaryCategoryIds.includes(categoryId))
  }));
  const latestPosts = publishedBlogs.slice(0, 3).map((post) => {
    const date = post.publishedAt || post.createdAt;
    return {
      slug: post.slug,
      title: post.title,
      coverImageUrl: post.coverImageUrl,
      excerpt: blogExcerpt(post),
      dateTime: date.toISOString(),
      dateLabel: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
    };
  });
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${absoluteUrl('/')}#website`, url: absoluteUrl('/'), name: siteName, alternateName: 'Freemium AI Tools' },
      { '@type': 'Organization', '@id': `${absoluteUrl('/')}#organization`, name: siteName, url: absoluteUrl('/'), email: 'hello@freemiumaitools.com' },
      {
        '@type': 'FAQPage',
        '@id': `${absoluteUrl('/')}#faq`,
        mainEntity: homepageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  };
  return (
    <>
      <JsonLd data={homeSchema} />
      <Header heroContrast />
      <main id="main-content">
        <section className={styles.hero}>
          <GridPulse className={styles.heroPulse} />
          <div className={`${ui.shell} ${styles.heroContent}`}>
            <div className={styles.heroCopy} data-grid-avoid>
              <span className={ui.eyebrow}><span className={styles.eyebrowDot} /> Hands-on AI tool reviews</span>
              <h1>Free AI Tools Directory with Honest Tool Reviews</h1>
              <p>Compare free and freemium AI tools for your business. Every review is based on real use, with our own screenshots, pricing and free plan limits.</p>
              <div className={styles.heroActions}>
                <a href="#directory" className={ui.primaryButton}>Explore tools <ArrowIcon /></a>
                <Link href="/categories/" className={ui.primaryButton}>Browse categories</Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.toolTicker} aria-label="Tools listed in the directory">
          <span className={styles.tickerLabel}>Tools we cover</span>
          <div className={styles.tickerViewport}>
            <div className={styles.tickerTrack}>
              {[0, 1].map((copy) => (
                <div className={styles.tickerGroup} aria-hidden={copy === 1 ? 'true' : undefined} key={copy}>
                  {tickerTools.map((tool) => (
                    <Link
                      aria-label={tool.external ? `${tool.name} official website` : undefined}
                      className={styles.tickerItem}
                      href={tool.href}
                      key={`${copy}-${tool.name}`}
                      rel={tool.external ? 'noopener noreferrer' : undefined}
                      tabIndex={copy === 1 ? -1 : undefined}
                      target={tool.external ? '_blank' : undefined}
                    >
                      <img
                        alt=""
                        className={styles.tickerLogo}
                        draggable="false"
                        height="32"
                        loading="eager"
                        src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(tool.website)}&sz=64`}
                        width="32"
                      />
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomepageCategories categories={homepageCategories} />
        <HomepageContent aboutOnly posts={[]} reviewer={{}} />
        <HomepageContent showAbout={false} posts={latestPosts} reviewer={reviewer} />
      </main>
      <Footer />
    </>
  );
}

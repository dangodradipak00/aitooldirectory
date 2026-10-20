import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import JsonLd from '../../../components/JsonLd';
import { ExternalIcon, VerifiedIcon } from '../../../components/Icons';
import EmbedBadge from './EmbedBadge';
import ShareButton from './ShareButton';
import { getCategory, getSubcategory, mainCategories } from '../../../data/categories';
import { publishedTools } from '../../../data/tools';
import { getVendorLinkRel } from '../../../lib/link-utils';
import { getPublicRelatedTools, getPublicTool } from '../../../lib/public-tools';
import { absoluteUrl, editorialTeamName } from '../../../lib/site';
import MarkdownContent from '../../../components/MarkdownContent';
import styles from './page.module.css';
import ui from '../../../styles/ui.module.css';

function SocialIcon({ network }) {
  if (network === 'x') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.2h3.7l-8.1 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.3H4.3l13.3 17.3Z"/></svg>;
  if (network === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.8 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.5c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.3H7V13h3v9h3.8Z"/></svg>;
  if (network === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 7.7A2.2 2.2 0 1 0 5.3 3.3a2.2 2.2 0 0 0 0 4.4ZM3.5 9.2h3.6V21H3.5V9.2ZM9.3 9.2h3.5v1.6h.1c.5-.9 1.7-2 3.5-2 3.7 0 4.4 2.5 4.4 5.7V21h-3.6v-5.8c0-1.4 0-3.2-1.9-3.2s-2.3 1.5-2.3 3.1V21H9.3V9.2Z"/></svg>;
  if (network === 'youtube') return <svg className={styles.youtubeLogo} viewBox="0 0 24 18" aria-hidden="true"><rect className={styles.youtubeBody} x="0" y="0" width="24" height="18" rx="5"/><path className={styles.youtubePlay} d="m9.5 5 7 4-7 4V5Z"/></svg>;
  return <svg className={styles.socialStrokeIcon} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg>;
}

function getPricingType(pricing) {
  const normalizedPricing = pricing.trim().toLowerCase();
  if (normalizedPricing === 'free') return 'Free';
  if (normalizedPricing.includes('free')) return 'Freemium';
  return 'Premium';
}

export function generateStaticParams() {
  return publishedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = await getPublicTool(slug);
  if (!tool) return {};
  return {
    title: tool.seoTitle || `${tool.name}: Features, Pricing, Pros & Cons`,
    description: tool.seoDescription || `Explore ${tool.name} features, pricing, pros, cons and key use cases to understand whether it fits your business, team or workflow.`,
    alternates: { canonical: `/tools/${tool.slug}/` },
    openGraph: { title: `${tool.name}: Features, Pricing, Pros & Cons`, description: tool.summary, url: `/tools/${tool.slug}/`, type: 'article' }
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = await getPublicTool(slug);
  if (!tool) notFound();
  const category = getCategory(tool.primaryCategoryId);
  if (!category) notFound();
  const pricingType = getPricingType(tool.pricing);
  const vendorLinkRel = getVendorLinkRel(tool);
  const toolPageUrl = absoluteUrl(`/tools/${tool.slug}/`);
  const toolSubcategories = tool.subcategoryIds.map(getSubcategory).filter(Boolean);
  const otherCategories = mainCategories.filter((item) => item.id !== category.id);
  const details = tool.details;
  const structuredPros = tool.pros || [];
  const structuredCons = tool.cons || [];
  const structuredUseCases = tool.useCases || [];
  const structuredFaqs = tool.faqs || [];
  const heroImage = tool.websiteImageUrl || details?.heroImage;
  const relatedTools = (await getPublicRelatedTools(tool.slug, tool.primaryCategoryId))
    .map((candidate) => ({
      ...candidate,
      sharedSubcategories: candidate.subcategoryIds
        .filter((subcategoryId) => tool.subcategoryIds.includes(subcategoryId))
        .map(getSubcategory)
        .filter(Boolean)
    }))
    .sort((a, b) => b.sharedSubcategories.length - a.sharedSubcategories.length || a.name.localeCompare(b.name))
    .slice(0, 4);
  const toolSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${toolPageUrl}#webpage`, url: toolPageUrl,
        name: `${tool.name}: Features, Pricing, Pros & Cons`, description: tool.summary,
        author: { '@type': 'Organization', name: editorialTeamName, url: absoluteUrl('/authors/editorial-team/') },
        about: { '@type': 'SoftwareApplication', name: tool.name, description: tool.summary, applicationCategory: category.name, operatingSystem: 'Web', sameAs: tool.website }
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/categories/${category.slug}/`) },
          { '@type': 'ListItem', position: 3, name: tool.name, item: toolPageUrl }
        ]
      },
      ...(structuredFaqs.length > 0 ? [{
        '@type': 'FAQPage',
        '@id': `${toolPageUrl}#faqs`,
        url: `${toolPageUrl}#faqs`,
        name: `${tool.name} frequently asked questions`,
        mainEntity: structuredFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }] : [])
    ]
  };

  return (
    <>
      <JsonLd data={toolSchema} />
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={`${ui.shell} ${styles.breadcrumb}`}><Link href="/">Home</Link><span>/</span><Link href={`/categories/${category.slug}/`}>{category.name}</Link><span>/</span><span>{tool.name}</span></div>

        <section className={styles.detailHero}>
          <div className={`${ui.shell} ${styles.profileCard}`}>
            <div className={styles.profileHeader}>
              <div className={styles.profileIdentity}>
                <div className={`${styles.detailLogo} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>{tool.logoUrl ? <img src={tool.logoUrl} alt="" /> : tool.initials}</div>
                <div className={styles.detailTitle}>
                  <h1>{tool.name} <span className={styles.verifiedMark} title="Information checked by the AgencyToolGuide editorial team" aria-label="Editorially checked profile"><VerifiedIcon /></span></h1>
                  <div className={styles.titleBadges}>
                    <span className={`${styles.pricingType} ${styles[`pricing${pricingType}`]}`}>{tool.pricing}</span>
                    {tool.sponsored && <span className={styles.sponsoredDisclosure}>Sponsored listing</span>}
                  </div>
                </div>
              </div>
              <div className={styles.profileActions}>
                <ShareButton title={`Explore ${tool.name} on AgencyToolGuide`} />
                <a className={styles.siteButton} href={tool.website} target="_blank" rel={vendorLinkRel}><ExternalIcon /> Visit this site</a>
              </div>
            </div>

            <div className={styles.profileDivider} />

            <div className={styles.profileBody}>
              <div className={styles.mediaColumn}>
                <a className={styles.heroMedia} href={tool.website} target="_blank" rel={vendorLinkRel} aria-label={`Visit the official ${tool.name} website`}>
                  {heroImage ? (
                    <img className={styles.heroImage} src={heroImage} alt={details?.heroImageAlt || `${tool.name} product preview`} />
                  ) : (
                    <>
                      <span className={styles.mediaEyebrow}>Featured tool</span>
                      <span className={styles.mediaMark}>{tool.initials}</span>
                      <strong>{tool.name}</strong>
                      <p>{tool.highlights.length ? tool.highlights.join(' • ') : tool.summary}</p>
                    </>
                  )}
                  <span className={styles.mediaOverlay}>Visit Website <ExternalIcon /></span>
                </a>

                <div className={styles.tagList} aria-label={`${tool.name} categories and subcategories`}>
                  <span className={styles.utilityTag}>Website</span>
                  <span className={styles.utilityTag}>{tool.pricing}</span>
                  <span className={styles.categoryTag}>{category.name}</span>
                  {toolSubcategories.map((subcategory) => <span className={styles.subcategoryTag} key={subcategory.id}>{subcategory.name}</span>)}
                </div>
              </div>

              <div className={styles.profileSummary}>
                <div className={styles.summaryQuote}><p>{tool.summary}</p></div>
                {tool.bestFor && <p className={styles.bestFor}><strong>Best for:</strong> {tool.bestFor}</p>}
                {tool.socialLinks?.length > 0 && (
                  <div className={styles.socialRow}>
                    <span>Social &amp; email</span>
                    <div className={styles.socialLinks}>
                      {tool.socialLinks.map((social) => (
                        <a key={social.network} className={styles[`social${social.network[0].toUpperCase()}${social.network.slice(1)}`]} href={social.url} target={social.network === 'email' ? undefined : '_blank'} rel={social.network === 'email' ? undefined : vendorLinkRel} aria-label={social.label} title={social.label}><SocialIcon network={social.network} /></a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailContent}>
          <div className={`${ui.shell} ${styles.detailGrid}`}>
            <article className={styles.detailMain}>
              {tool.contentMarkdown ? (
                <>
                  <div className={styles.contentArticle}>
                    <MarkdownContent content={tool.contentMarkdown} className={styles.markdownContent} />
                  </div>
                  {(structuredPros.length > 0 || structuredCons.length > 0) && <section id="pros-cons" className={styles.proConStandalone}><div className={styles.proConGrid}>{structuredPros.length > 0 && <div className={styles.proBox}><h3>Pros</h3><ul>{structuredPros.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}{structuredCons.length > 0 && <div className={styles.conBox}><h3>Cons</h3><ul>{structuredCons.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}</div></section>}
                  {structuredUseCases.length > 0 && <div className={styles.contentArticle}><section id="use-cases" className={styles.contentSection}><h2>Popular {tool.name} use cases</h2><div className={styles.useCaseGrid}>{structuredUseCases.map((item, index) => <div key={`${item.title}-${index}`}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div></section></div>}
                  {structuredFaqs.length > 0 && <div className={styles.contentArticle}><section id="faqs" className={styles.contentSection}><h2>Frequently asked questions</h2><div className={styles.faqList}>{structuredFaqs.map((faq, index) => <div key={`${faq.question}-${index}`}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</div></section></div>}
                </>
              ) : details ? (
                <>
                  <div className={styles.contentArticle}>
                    <section id="what-is" className={styles.contentSection}><h2>What is {tool.name}?</h2><p>{details.introduction}</p></section>
                    <section id="who-should-use" className={styles.contentSection}><h2>Who should use {tool.name}?</h2><p>{details.audience}</p></section>
                    <section id="how-it-works" className={styles.contentSection}><h2>How does {tool.name} work?</h2><ol className={styles.stepList}>{details.workflow.map((step) => <li key={step}>{step}</li>)}</ol></section>
                    <section id="pricing" className={styles.contentSection}><h2>{tool.name} pricing and plans</h2><p>{details.pricingSummary}</p><p className={styles.verified}>Pricing information checked: {details.pricingVerified}</p></section>
                    {details.features?.length > 0 && <section id="features" className={styles.contentSection}><h2>Key features of {tool.name}</h2><div className={styles.featureList}>{details.features.map((feature) => <div key={feature.name}><h3>{feature.name}</h3><p>{feature.description}</p></div>)}</div></section>}
                    {details.editorialSummary && <section id="conclusion" className={styles.contentSection}><h2>Conclusion</h2><p>{details.editorialSummary}</p></section>}
                  </div>
                  {(details.pros?.length > 0 || details.cons?.length > 0) && <section id="pros-cons" className={styles.proConStandalone}><div className={styles.proConGrid}><div className={styles.proBox}><h3>Pros</h3><ul>{details.pros.map((item) => <li key={item}>{item}</li>)}</ul></div><div className={styles.conBox}><h3>Cons</h3><ul>{details.cons.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>}
                  {details.useCases?.length > 0 && <div className={styles.contentArticle}><section id="use-cases" className={styles.contentSection}><h2>Popular {tool.name} use cases</h2><div className={styles.useCaseGrid}>{details.useCases.map((item) => <div key={item.name}><h3>{item.name}</h3><p>{item.description}</p></div>)}</div></section></div>}
                  {details.faqs?.length > 0 && <div className={styles.contentArticle}><section id="faqs" className={styles.contentSection}><h2>Frequently asked questions</h2><div className={styles.faqList}>{details.faqs.map((faq) => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</div></section></div>}
                </>
              ) : (
                <div className={styles.contentArticle}>
                  <section className={styles.contentSection}><h2>Who it may suit</h2><p>{tool.bestFor}</p></section>
                  <section className={styles.contentSection}><h2>What to review</h2><ul className={styles.checkList}>{tool.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section className={styles.contentSection}><h2>Editorial note</h2><p>This overview is for initial software discovery. Features and pricing can change; confirm current details directly with the vendor.</p></section>
                </div>
              )}
            </article>
            <aside className={styles.adSidebar} aria-label="Tool discovery sidebar">
              <article className={`${styles.adCard} ${styles.adCardNeutral}`}>
                <span className={styles.adLabel}>Ad</span>
                <div className={styles.adCardHeader}>
                  <span className={styles.adBrandMark} aria-hidden="true">A</span>
                  <h2>Sponsor your tool</h2>
                </div>
                <p>Put your tool in front of relevant buyers, gain more referral traffic and grow brand visibility.</p>
                <Link className={styles.adButton} href="/submit/">Sponsor your tool <span aria-hidden="true">&rarr;</span></Link>
              </article>

              <nav className={styles.otherCategoriesCard} aria-labelledby="other-categories-title">
                <span className={styles.categoriesEyebrow}>Explore the directory</span>
                <h2 id="other-categories-title">Other categories</h2>
                <ul>
                  {otherCategories.map((item) => (
                    <li key={item.id}><Link href={`/categories/${item.slug}/`}>{item.name}<span aria-hidden="true">&rarr;</span></Link></li>
                  ))}
                </ul>
                <Link className={styles.allCategoriesLink} href="/categories/">View all categories <span aria-hidden="true">&rarr;</span></Link>
              </nav>
            </aside>
          </div>
        </section>

        <section className={styles.embedSection}>
          <div className={ui.shell}>
            <EmbedBadge toolName={tool.name} slug={tool.slug} />
          </div>
        </section>

        {relatedTools.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={ui.shell}>
              <div className={styles.relatedHeading}>
                <span>Keep exploring</span>
                <h2>Related tools</h2>
                <p>Tools in {category.name} that share one or more subcategories with {tool.name}.</p>
              </div>
              <div className={styles.relatedGrid}>
                {relatedTools.map((relatedTool) => (
                  <article className={styles.relatedCard} key={relatedTool.slug}>
                    <div className={styles.relatedCardMeta}>
                      <span><i aria-hidden="true" />{relatedTool.pricing}</span>
                      <span>{relatedTool.sharedSubcategories.length} {relatedTool.sharedSubcategories.length === 1 ? 'match' : 'matches'}</span>
                    </div>
                    <div className={styles.relatedCardBody}>
                      <div className={styles.relatedCardTop}>
                      <div className={`${styles.relatedLogo} ${styles[`accent${category.accent[0].toUpperCase()}${category.accent.slice(1)}`]}`}>{relatedTool.initials}</div>
                        <div>
                          <h3><Link href={`/tools/${relatedTool.slug}/`}>{relatedTool.name}</Link></h3>
                        </div>
                      </div>
                      <p>“{relatedTool.summary}”</p>
                      <div className={styles.relatedTags}>{relatedTool.sharedSubcategories.map((subcategory) => <span key={subcategory.id}>{subcategory.name}</span>)}</div>
                      <Link className={styles.relatedLink} href={`/tools/${relatedTool.slug}/`}><ExternalIcon /> View tool</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

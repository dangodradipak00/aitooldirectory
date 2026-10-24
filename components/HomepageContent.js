import Link from 'next/link';
import { ArrowIcon } from './Icons';
import { homepageFaqs, submissionPlans } from '../lib/homepage-config';
import styles from './HomepageContent.module.css';
import ui from '../styles/ui.module.css';

function SectionHeading({ eyebrow, id, subtext, title }) {
  return (
    <div className={`${ui.sectionHeading} ${styles.sectionHeading}`}>
      <span className={ui.eyebrow}>{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {subtext ? <p>{subtext}</p> : null}
    </div>
  );
}

function ProcessIcon({ type }) {
  if (type === 'screenshots') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m5 17 4-4 3 3 3-3 4 4"/></svg>;
  if (type === 'check') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5z"/><path d="m8 9 2 2 4-4M8 16h8"/></svg>;
  if (type === 'disclosure') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v5c0 4.8 3.2 7.5 8 9 4.8-1.5 8-4.2 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5h16v14H4Z"/><path d="M8 9h8M8 13h5M8 17h7"/></svg>;
}

function BlogCard({ post, index }) {
  return (
    <article className={`${styles.card} ${styles.blogCard}`}>
      <Link className={styles.blogMedia} data-tone={index % 3} href={`/blog/${post.slug}/`}>
        {post.coverImageUrl ? (
          <img alt={`${post.title} cover`} height="360" loading="lazy" src={post.coverImageUrl} width="640" />
        ) : (
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        )}
      </Link>
      <div className={styles.blogBody}>
        <time dateTime={post.dateTime}>{post.dateLabel}</time>
        <h3><Link href={`/blog/${post.slug}/`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <Link className={styles.textLink} href={`/blog/${post.slug}/`}>Read more <ArrowIcon /></Link>
      </div>
    </article>
  );
}

export default function HomepageContent({ posts, reviewer, aboutOnly = false, showAbout = true }) {
  const reviewerReady = reviewer?.name && reviewer?.role && reviewer?.bio && reviewer?.photo;

  return (
    <>
      {showAbout ? <section className={`${styles.section} ${styles.whiteSection}`} aria-labelledby="about-directory-title">
        <div className={`${ui.shell} ${styles.narrowContent}`}>
          <SectionHeading eyebrow="ABOUT THE DIRECTORY" id="about-directory-title" title="What is FreemiumAItools?" />
          <div className={styles.aboutCopy}>
            <p>FreemiumAItools is a free AI tools directory with hands-on tool reviews. We help business owners and founders find AI tools that fit their work, and see what each one costs before they sign up.</p>
            <p>Many AI tools are free to start but limit what you can do. For every tool we test, we check the free plan, the paid plans and where the limits show up, so you can compare AI tools without guesswork.</p>
            <p>Browse by category, read a review, then decide. If you build an AI tool, you can submit it for free or request a full editorial profile.</p>
          </div>
          <div className={styles.actions}>
            <Link className={ui.primaryButton} href="/categories/">Browse categories <ArrowIcon /></Link>
            <Link className={ui.primaryButton} href="/submit/">Submit a tool</Link>
          </div>
        </div>
      </section> : null}

      {!aboutOnly ? <>
      <section className={`${styles.section} ${styles.tintSection} ${styles.processSection}`} id="how-we-review" aria-labelledby="how-we-review-title">
        <div className={`${ui.shell} ${styles.processShell}`}>
          <SectionHeading eyebrow="OUR PROCESS" id="how-we-review-title" title="How we test and review AI tools" subtext="Every review comes from real use, not a feature list." />
          <div className={styles.processGrid}>
            {[
              ['testing', 'Hands-on testing', 'We sign up, use each tool on real tasks and note what works and what does not. We do not write reviews from a feature list.'],
              ['screenshots', 'Real screenshots', 'The screenshots in our reviews come from our own testing, so you see the actual interface.'],
              ['check', 'What we check', 'Free plan limits, paid pricing, ease of use, output quality, support and who the tool suits.'],
              ['disclosure', 'Paid profiles and disclosure', 'Free submissions are welcome. Paid profiles are labeled, and paying does not guarantee a positive review, traffic or rankings.']
            ].map(([type, title, text], index) => (
              <article className={`${styles.card} ${styles.infoCard} ${styles.processCard}`} key={title}>
                <span className={styles.processStep}>{index + 1}</span>
                <span className={styles.icon}><ProcessIcon type={type} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                {index < 3 ? <span className={styles.processArrow} aria-hidden="true">→</span> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.whiteSection}`} aria-labelledby="submission-plans-title">
        <div className={ui.shell}>
          <SectionHeading eyebrow="FOR TOOL OWNERS" id="submission-plans-title" title="Submit your AI tool for review" subtext="Submitting is free. Upgrade for a full editorial tool profile from $9. Every submission is reviewed before payment." />
          <div className={styles.planGrid}>
            {submissionPlans.map((plan) => (
              <article className={`${styles.card} ${styles.planCard} ${plan.recommended ? styles.recommended : ''}`} key={plan.id}>
                {plan.recommended ? <span className={styles.recommendedLabel}>Recommended</span> : null}
                <h3>{plan.name}</h3>
                <strong className={styles.planPrice}>{plan.price}</strong>
                <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <Link className={ui.primaryButton} href={plan.href}>{plan.buttonLabel}</Link>
              </article>
            ))}
          </div>
          <p className={styles.sectionNote}>Commercial relationships are disclosed, and no traffic or ranking is guaranteed.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tintSection}`} aria-labelledby="homepage-faq-title">
        <div className={`${ui.shell} ${styles.faqShell}`}>
          <SectionHeading eyebrow="FAQ" id="homepage-faq-title" title="Frequently asked questions" />
          <div className={styles.faqList}>
            {homepageFaqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className={`${styles.section} ${styles.whiteSection}`} aria-labelledby="latest-guides-title">
          <div className={ui.shell}>
            <SectionHeading eyebrow="FROM THE BLOG" id="latest-guides-title" title="Latest guides and comparisons" />
            <div className={styles.threeGrid}>{posts.map((post, index) => <BlogCard index={index} key={post.slug} post={post} />)}</div>
            <div className={styles.centerAction}><Link className={ui.primaryButton} href="/blog/">View all posts <ArrowIcon /></Link></div>
          </div>
        </section>
      ) : null}

      {reviewerReady ? (
        <section className={`${styles.section} ${styles.tintSection} ${styles.reviewerSection}`} aria-labelledby="reviewer-title">
          <div className={`${ui.shell} ${styles.reviewerGrid}`}>
            <div className={styles.reviewerPhoto}>
              <img alt={`${reviewer.name}, ${reviewer.role}`} height="640" loading="lazy" src={reviewer.photo} width="640" />
            </div>
            <div className={styles.reviewerCopy}>
              <SectionHeading eyebrow="THE REVIEWER" id="reviewer-title" title="Who reviews the tools?" />
              <h3>{reviewer.name}</h3>
              <span>{reviewer.role}</span>
              <p>{reviewer.bio}</p>
              <div className={styles.actions}>
                <Link className={ui.primaryButton} href="/about/">About us</Link>
                <Link className={ui.primaryButton} href="/authors/editorial-team/">Editorial team</Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      </> : null}
    </>
  );
}

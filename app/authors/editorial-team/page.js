import InfoPage, { contactEmail } from '../../../components/InfoPage';

export const metadata = {
  title: 'AgencyToolGuide Editorial Team',
  description: 'Learn how the AgencyToolGuide Editorial Team researches, prepares and maintains AI tool profiles, comparisons and buying guides.',
  alternates: { canonical: '/authors/editorial-team/' },
};

export default function AuthorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AgencyToolGuide Editorial Team',
    email: contactEmail,
    description: 'The team responsible for researching, organizing and maintaining AgencyToolGuide AI tool profiles, category pages, comparisons and buying guides.',
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <InfoPage
      eyebrow="Author"
      title="AgencyToolGuide Editorial Team"
      updated="October 22, 2026"
      intro="The AgencyToolGuide Editorial Team researches, organizes and maintains our AI tool profiles, category pages, comparisons and buying guides. Our goal is simple: help you understand what a tool does, who it suits and what to check before you buy."
    >
      <section>
        <h2>What we do</h2>
        <ul>
          <li>Research official product pages, documentation, pricing pages and other public sources.</li>
          <li>Write clear tool profiles covering features, pros, cons, use cases and FAQs.</li>
          <li>Organize tools into categories so they are easy to compare.</li>
          <li>Review tool submissions from software owners by hand.</li>
          <li>Update or remove profiles when information changes.</li>
        </ul>
      </section>
      <section>
        <h2>How we prepare our content</h2>
        <p><strong>Identify the purpose.</strong> We work out what the tool is mainly for and which categories fit it.</p>
        <p><strong>Check the claims.</strong> We compare important claims against official vendor information.</p>
        <p><strong>Separate fact from opinion.</strong> Product facts and our editorial observations are kept apart.</p>
        <p><strong>Say what kind of content it is.</strong> We state when a page is an overview based on public information and not a hands-on review.</p>
        <p><strong>Keep it current.</strong> We revisit pages when we receive a correction, or when pricing or features change.</p>
      </section>
      <section>
        <h2>Experience and transparency</h2>
        <p>We do not make up credentials, test results or product experience. When we have personally used a tool, we say so. When a named specialist writes or tests a product, their name and contribution are shown on that article. Pricing and features change often, so please confirm details on the vendor’s website before you buy.</p>
      </section>
      <section>
        <h2>Editorial independence</h2>
        <p>We may earn money from paid listings, sponsored placements, advertising or affiliate links. Payment never buys a positive review or a higher opinion of a tool, and any sponsored or affiliate relationship is disclosed. Read more in our <a href="/disclaimer/">Disclaimer</a>.</p>
      </section>
      <section>
        <h2>Corrections and feedback</h2>
        <p>Found something wrong or outdated? Email <a href={`mailto:${contactEmail}?subject=Content%20Correction`}>{contactEmail}</a> with the page URL and a link to a supporting source. We review every report and fix confirmed errors as quickly as we can.</p>
      </section>
      <section>
        <h2>Own a tool?</h2>
        <p>You can <a href="/submit/">submit your tool for review</a> through the submission form. Every submission is reviewed by hand, and submitting does not guarantee publication.</p>
      </section>
    </InfoPage>
  </>;
}

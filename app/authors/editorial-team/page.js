import InfoPage, { contactEmail } from '../../../components/InfoPage';

export const metadata = { title: 'AgencyToolGuide Editorial Team', description: 'Meet the editorial team responsible for AgencyToolGuide tool profiles and software guides.', alternates: { canonical: '/authors/editorial-team/' } };

export default function AuthorPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'AgencyToolGuide Editorial Team', email: contactEmail, description: 'The team responsible for researching and maintaining AgencyToolGuide software profiles and guides.' };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <InfoPage eyebrow="Author" title="AgencyToolGuide Editorial Team" intro="The editorial team researches, structures and maintains AgencyToolGuide’s software profiles, category pages and practical buying guidance.">
      <section><h2>What we do</h2><p>We review official product pages, documentation, pricing information and other relevant public sources to explain what a tool does, who it may suit and which workflows it supports.</p></section>
      <section><h2>How our content is prepared</h2><ol><li>Identify the tool’s primary purpose and relevant categories.</li><li>Check important claims against official vendor information.</li><li>Separate factual product information from editorial observations.</li><li>State when content is an overview rather than a hands-on review.</li><li>Revisit material information when a correction or update is received.</li></ol></section>
      <section><h2>Experience and transparency</h2><p>AgencyToolGuide focuses on software discovery for agencies and marketing teams. We do not invent individual credentials, testing evidence or product experience. When a named specialist contributes or tests a product, that person’s identity and contribution should be shown on the relevant article.</p></section>
      <section><h2>Corrections</h2><p>Vendors and readers can report a factual issue by emailing <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the page URL and supporting source.</p></section>
    </InfoPage>
  </>;
}

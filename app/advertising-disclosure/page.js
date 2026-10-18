import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: 'Advertising and Sponsorship Disclosure', description: 'How AgencyToolGuide labels paid listings, sponsorships, affiliate links and commercial relationships.', alternates: { canonical: '/advertising-disclosure/' } };

export default function AdvertisingDisclosurePage() {
  return <InfoPage eyebrow="Transparency" title="Advertising & Sponsorship Disclosure" intro="AgencyToolGuide may earn revenue from paid submissions, sponsored placements, advertising or affiliate relationships. This page explains how those relationships are identified.">
    <section><h2>Sponsored listings</h2><p>A vendor-funded placement is labelled “Sponsored listing” or with another clear commercial label. Payment covers agreed production or placement work; it does not guarantee a positive opinion, score, traffic, leads or search-engine ranking.</p></section>
    <section><h2>Paid links</h2><p>Outbound links connected to compensation are marked with appropriate attributes such as <code>rel=&quot;sponsored nofollow&quot;</code>. Editorial links that are not connected to compensation are not labelled as sponsored merely because the software itself has a paid pricing plan.</p></section>
    <section><h2>Affiliate links</h2><p>If AgencyToolGuide can earn a commission from a purchase or signup, that relationship should be disclosed near the relevant content. The price paid by the visitor should not be increased without clear notice.</p></section>
    <section><h2>Editorial control</h2><p>Commercial partners may provide factual product information and request corrections. They do not receive a guarantee of favourable coverage or control over independent editorial conclusions.</p></section>
    <section><h2>Questions</h2><p>For questions about a commercial label or relationship, contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and include the relevant page URL.</p></section>
  </InfoPage>;
}

import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: 'Terms and Conditions', description: 'Terms governing access to AgencyToolGuide and use of its directory and submission services.', alternates: { canonical: '/terms-and-conditions/' } };

export default function TermsPage() {
  return <InfoPage eyebrow="Legal" title="Terms and Conditions" intro="By accessing AgencyToolGuide, you agree to use the website lawfully and understand the limits of our directory information and submission services.">
    <section><h2>Using the website</h2><p>You may use the directory for personal or internal business research. You must not interfere with website operation, bypass security, scrape at a harmful rate, submit unlawful material, impersonate another party or use the service to mislead users.</p></section>
    <section><h2>Directory information</h2><p>Tool features, availability and pricing can change. Directory content is provided for initial research and does not replace checking the vendor’s official website. Inclusion does not mean AgencyToolGuide owns, operates or endorses a listed product.</p></section>
    <section><h2>Submissions and paid services</h2><p>Submitters must have authority to provide the supplied text, logos, screenshots and links. Payment covers the deliverables stated at checkout or in the accepted order; it does not guarantee publication, a positive assessment, traffic, leads or search rankings. Sponsored relationships will be disclosed, and paid outbound links will be marked with appropriate sponsored and nofollow attributes for search engines.</p></section>
    <section><h2>Intellectual property</h2><p>AgencyToolGuide’s original design, branding and editorial content are protected by applicable intellectual-property laws. Vendor names, logos and trademarks remain the property of their respective owners. Limited use for identification does not imply affiliation.</p></section>
    <section><h2>External websites</h2><p>Links may lead to independent third-party services. We are not responsible for their availability, terms, security, pricing or actions. Visitors should review the vendor’s current information before purchasing.</p></section>
    <section><h2>Availability and liability</h2><p>The website is provided on an “as available” basis. To the maximum extent permitted by law, AgencyToolGuide is not liable for indirect or consequential loss arising from reliance on directory information or third-party products. Nothing here excludes rights or liabilities that cannot legally be excluded.</p></section>
    <section><h2>Changes and contact</h2><p>We may change, suspend or remove content and update these terms. Continued use after an update means the revised terms apply. Questions can be sent to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></section>
  </InfoPage>;
}

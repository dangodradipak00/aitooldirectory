import InfoPage, { contactEmail } from '../../components/InfoPage';
import { siteUrl } from '../../lib/site';

export const metadata = { title: { absolute: 'Disclaimer | FreemiumAITools' }, description: 'Read the FreemiumAITools disclaimer about the accuracy of information, third-party links, external content and the limits of our responsibility to all users.', alternates: { canonical: '/disclaimer/' } };

export default function DisclaimerPage() {
  return <InfoPage eyebrow="Transparency" title="Disclaimer" effective="October 22, 2026">
    <section><h2>General information only</h2><p>Everything on {siteUrl} (the "Website"), including tool profiles, blog posts, guides, comparisons and recommendations, is for general information and education only. FreemiumAITools is an independent directory and publication.</p></section>
    <section><h2>Not professional advice</h2><p>Nothing on the Website is legal, financial, tax, investment, medical or other professional advice. Our articles may include opinions and general guidance, so please talk to a qualified professional about your own situation.</p></section>
    <section><h2>Third-party tools and claims</h2><p>We list software we do not own or operate. Descriptions, features, pros, cons and FAQs may come from tool owners, public sources or our editors. Listing a tool does not mean we test, verify, certify or endorse it, and claims made by tool providers are their own, not ours.</p></section>
    <section><h2>Accuracy and changes</h2><p>Pricing, plans, features, limits and availability change often and without notice. We try to keep the directory accurate but cannot promise it is complete or current. Please confirm important details with the provider before you buy or rely on a tool.</p></section>
    <section><h2>No guarantee of results</h2><p>Being listed, featured, sponsored or reviewed on the Website does not guarantee traffic, leads, sales, backlinks or search rankings, and we do not promise any result from using a listed tool.</p></section>
    <section><h2>Advertising, sponsored and affiliate disclosure</h2><p>We may earn money from paid listings, featured or sponsored placements, advertising and affiliate links. If you buy through an affiliate link, we may earn a commission at no extra cost to you. Payment never buys a positive review or changes our editorial opinion. Where a link or placement is sponsored or affiliate-based, we aim to label it clearly, and not every link on the Website is an affiliate link.</p></section>
    <section><h2>External links</h2><p>When you click a “Visit” button or any other external link, you leave the Website. We do not control third-party sites or products and are not responsible for their content, security, pricing or policies, or for any loss from using them.</p></section>
    <section><h2>Use at your own risk</h2><p>The Website is provided “as is” and “as available”. To the fullest extent permitted by law, we are not responsible for loss or damage from using the Website or relying on its content. See our <a href="/terms-and-conditions/">Terms and Conditions</a> for details.</p></section>
    <section><h2>Contact</h2><p>Corrections or removal requests: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></section>
  </InfoPage>;
}

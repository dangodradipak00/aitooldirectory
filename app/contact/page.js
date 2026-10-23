import InfoPage, { contactEmail } from '../../components/InfoPage';
import { siteUrl } from '../../lib/site';

export const metadata = { title: { absolute: 'Contact Us | FreemiumAITools' }, description: 'Have a question, suggestion or partnership idea? Get in touch with the FreemiumAITools team using our contact form and we will reply as soon as possible.', alternates: { canonical: '/contact/' } };

export default function ContactPage() {
  return <InfoPage eyebrow="Get in touch" title="Contact Us" showDates={false} intro={<>For any question, correction or request, email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We read every message and usually reply within 2 to 3 business days.</>}>
    <section><h2>What to contact us about</h2><table><thead><tr><th>Topic</th><th>What to include in your email</th></tr></thead><tbody><tr><td>Submitting or updating a tool listing</td><td>Tool name, website URL and what you would like changed or added</td></tr><tr><td>Paid listings, sponsored placements or partnerships</td><td>Your tool or company name, website and what you are interested in</td></tr><tr><td>Correcting wrong or outdated information</td><td>The page URL and the correction, with a source if you have one</td></tr><tr><td>Removing a listing or content</td><td>The page URL and your relationship to the tool or content</td></tr><tr><td>Privacy or data requests</td><td>Subject line “Privacy Request”, your name and the email you used with us</td></tr><tr><td>Copyright concerns</td><td>Subject line “Copyright Notice” and the details described in our Terms and Conditions</td></tr><tr><td>General questions or feedback</td><td>Whatever is on your mind</td></tr></tbody></table></section>
    <section><h2>Tips for a faster reply</h2><ul><li>Use a clear subject line, such as “Tool Submission” or “Correction”.</li><li>Include the link to the page you are writing about.</li><li>Please do not send passwords, payment card numbers or other sensitive information by email.</li></ul></section>
    <section><h2>Contact details</h2><p><strong>Website:</strong> <a href={siteUrl}>{siteUrl}</a><br /><strong>Email:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p></section>
  </InfoPage>;
}

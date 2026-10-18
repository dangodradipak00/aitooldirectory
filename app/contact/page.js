import InfoPage, { contactEmail } from '../../components/InfoPage';
import styles from '../../components/InfoPage.module.css';

export const metadata = { title: 'Contact Us', description: 'Contact AgencyToolGuide about listings, corrections, privacy or business enquiries.', alternates: { canonical: '/contact/' } };

export default function ContactPage() {
  return <InfoPage eyebrow="Get in touch" title="Contact AgencyToolGuide" intro="Send us a clear message with the relevant tool or page URL. We use one inbox so corrections, listing questions and policy requests can be routed properly.">
    <section><h2>Email us</h2><p className={styles.notice}>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p><p>Please include the page URL, your relationship to the tool or company, and the exact change or question. Never email passwords, payment-card details or other sensitive credentials.</p></section>
    <section><h2>What can we help with?</h2><div className={styles.contactGrid}><div className={styles.contactCard}><strong>Listing corrections</strong><p>Report inaccurate features, pricing, ownership or official links.</p></div><div className={styles.contactCard}><strong>Tool submissions</strong><p>Ask about eligibility, deliverables, review status or listing updates.</p></div><div className={styles.contactCard}><strong>Privacy requests</strong><p>Request access, correction or deletion of personal information.</p></div><div className={styles.contactCard}><strong>Legal and rights</strong><p>Send copyright, trademark or other formal notices with supporting details.</p></div></div></section>
    <section><h2>Response expectations</h2><p>We aim to review genuine enquiries within five business days. Complex correction, privacy or legal requests may take longer while we verify the requester and relevant information.</p></section>
  </InfoPage>;
}

import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: 'Privacy Policy', description: 'How AgencyToolGuide collects, uses, stores and protects personal information.', alternates: { canonical: '/privacy-policy/' } };

export default function PrivacyPolicyPage() {
  return <InfoPage eyebrow="Legal" title="Privacy Policy" intro="This policy explains what information AgencyToolGuide may collect, why we use it and the choices available to visitors and tool submitters.">
    <section><h2>Information we collect</h2><p>We may collect information you submit directly, such as your name, business email, company or tool details, message content and submission choices. Technical information may include IP address, browser type, device information, referring pages and activity needed for security, analytics or service operation.</p></section>
    <section><h2>How we use information</h2><ul><li>Respond to enquiries and process tool submissions.</li><li>Verify, publish, update or remove directory information.</li><li>Operate, secure and improve the website.</li><li>Process payments and maintain transaction records.</li><li>Measure performance and comply with legal obligations.</li></ul></section>
    <section><h2>Payments and service providers</h2><p>Payments may be handled by a third-party payment provider. AgencyToolGuide does not need to store complete payment-card details. Hosting, analytics, email, security and payment providers may process limited information under their own terms and privacy practices.</p></section>
    <section><h2>Cookies and advertising</h2><p>We may use essential storage, analytics cookies and—if enabled—advertising technologies. Where consent is legally required, optional technologies should not be activated until the visitor has made a choice. See our <a href="/cookie-policy/">Cookie Policy</a> for more detail.</p></section>
    <section><h2>Retention and security</h2><p>We retain personal information only as long as reasonably needed for the stated purpose, record keeping, dispute resolution, fraud prevention and legal compliance. No online system is completely secure, but reasonable technical and organisational safeguards should be used.</p></section>
    <section><h2>Your choices and rights</h2><p>Depending on your location, you may have rights to access, correct, delete, restrict or object to certain processing, or withdraw consent. Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with “Privacy request” in the subject. We may need to verify your identity.</p></section>
    <section><h2>International visitors and children</h2><p>Service providers may process information in countries different from yours. AgencyToolGuide is intended for business and general audiences and is not directed to children under 13. Do not submit a child’s personal information.</p></section>
    <section><h2>Policy changes</h2><p>We may update this policy as the website and its providers change. The current version and effective date will remain available on this page.</p></section>
  </InfoPage>;
}

import InfoPage, { contactEmail } from '../../components/InfoPage';
import { siteUrl } from '../../lib/site';

export const metadata = { title: { absolute: 'Cookie Policy | FreemiumAITools' }, description: 'Learn which cookies FreemiumAITools uses, why we use them, and how you can manage, block or disable cookies in your browser settings whenever you want.', alternates: { canonical: '/cookie-policy/' } };

export default function CookiePolicyPage() {
  return <InfoPage eyebrow="Legal" title="Cookie Policy" effective="October 22, 2026">
    <section><h2>1. What cookies are</h2><p>Cookies and similar browser storage are small pieces of data a website saves on your device so it can work properly and remember your choices.</p></section>
    <section><h2>2. What we use</h2><p>At present, {siteUrl} uses only these:</p><table><thead><tr><th>Type</th><th>Purpose</th><th>Who it affects</th></tr></thead><tbody><tr><td>Strictly necessary</td><td>Admin login, session security, fraud and abuse prevention</td><td>Our administrators</td></tr><tr><td>Preference</td><td>Remembering your light or dark display mode</td><td>All visitors</td></tr></tbody></table></section>
    <section><h2>3. What we do not use</h2><p>We do not currently use analytics cookies, advertising or marketing cookies, social media pixels or cross-site tracking. If we add any of these later, we will update this policy first and, where required, ask for your consent.</p></section>
    <section><h2>4. Third-party cookies</h2><p>If you click an external link, such as a tool’s “Visit” button, the other site may set its own cookies under its own policy.</p></section>
    <section><h2>5. Your choices</h2><p>You can block or delete cookies in your browser settings. Blocking necessary cookies may stop admin login from working, and clearing browser storage resets your display mode. Questions: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></section>
  </InfoPage>;
}

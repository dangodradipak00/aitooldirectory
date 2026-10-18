import InfoPage from '../../components/InfoPage';

export const metadata = { title: 'Cookie Policy', description: 'Learn how AgencyToolGuide uses cookies, local storage and similar technologies.', alternates: { canonical: '/cookie-policy/' } };

export default function CookiePolicyPage() {
  return <InfoPage eyebrow="Legal" title="Cookie Policy" intro="This page explains how cookies and similar browser technologies may be used on AgencyToolGuide and how visitors can control them.">
    <section><h2>What these technologies are</h2><p>Cookies are small text files stored by a browser. Similar technologies include local storage, pixels and tags. AgencyToolGuide currently uses browser storage to remember preferences such as light or dark theme and may add consented analytics or advertising tools as the service develops.</p></section>
    <section><h2>Types we may use</h2><ul><li><strong>Essential:</strong> security, navigation and preferences required for expected website behaviour.</li><li><strong>Analytics:</strong> aggregated information about traffic and feature usage.</li><li><strong>Advertising:</strong> measurement, frequency control and personalisation where permitted.</li><li><strong>Third-party:</strong> technologies used by embedded, payment or service providers.</li></ul></section>
    <section><h2>Your choices</h2><p>You can block or delete storage through your browser. Where a consent banner is displayed, use it to accept, reject or change optional categories. Blocking essential storage may affect preferences or website functionality.</p></section>
    <section><h2>Google services</h2><p>If Google Analytics, Google Ads or AdSense is enabled, Google and its partners may use cookies or identifiers for measurement and advertising. Available controls may include Google’s advertising settings and the consent choices shown on this website.</p></section>
    <section><h2>Updates</h2><p>This policy will be updated when the technologies or providers used by AgencyToolGuide materially change.</p></section>
  </InfoPage>;
}

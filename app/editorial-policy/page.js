import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: 'Editorial Policy', description: 'How AgencyToolGuide researches, writes, labels, reviews and updates software content.', alternates: { canonical: '/editorial-policy/' } };

export default function EditorialPolicyPage() {
  return <InfoPage eyebrow="How we work" title="Editorial Policy" intro="Our goal is to make software discovery clearer while being honest about what we checked, what we tested and how commercial relationships are handled.">
    <section><h2>Research standards</h2><p>We start with official vendor websites, product documentation, pricing pages and other relevant primary sources. Important details such as pricing, plan limits and availability can change, so readers are directed to confirm them with the vendor.</p></section>
    <section><h2>Overviews and hands-on reviews</h2><p>A directory profile or editorial overview is not automatically a hands-on review. We only claim first-hand testing when we actually used the product and describe the method or evidence. We do not invent accounts, screenshots, measurements, testimonials or author credentials.</p></section>
    <section><h2>How AI may be used</h2><p>AI tools may assist with outlining, classification, language editing or repetitive production tasks. Published factual claims remain subject to editorial review. Automation must not be used to create large volumes of low-value pages or to fabricate experience.</p></section>
    <section><h2>Commercial independence</h2><p>Payment may support a sponsored listing or editorial production, but it does not buy a positive conclusion, rating, guaranteed publication, traffic or search ranking. Sponsored content is labelled, and paid outbound links use appropriate search-engine attributes.</p></section>
    <section><h2>Corrections and updates</h2><p>We correct material factual errors when they are verified. Send the page URL, the exact issue and a reliable supporting source to <a href={`mailto:${contactEmail}?subject=Editorial%20correction`}>{contactEmail}</a>. Vendors may request factual changes but cannot purchase removal of valid criticism or dictate an editorial conclusion.</p></section>
    <section><h2>Content dates</h2><p>A “checked” or “updated” date should reflect a meaningful review of the relevant information, not a cosmetic date change. Older pages may need reconfirmation before a purchasing decision.</p></section>
  </InfoPage>;
}

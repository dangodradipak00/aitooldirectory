import InfoPage from '../../components/InfoPage';

export const metadata = { title: 'Disclaimer', description: 'Important limitations and commercial disclosures for AgencyToolGuide content.', alternates: { canonical: '/disclaimer/' } };

export default function DisclaimerPage() {
  return <InfoPage eyebrow="Transparency" title="Disclaimer" intro="AgencyToolGuide is an independent discovery resource. Our pages are designed to support research, not to replace your own evaluation of a software product.">
    <section><h2>General information</h2><p>Content is provided for general informational purposes and is not legal, financial, security or professional advice. Features, prices, plan limits and availability can change without notice. Confirm material details with the vendor before making a decision.</p></section>
    <section><h2>No affiliation or endorsement</h2><p>Unless explicitly stated, AgencyToolGuide is not affiliated with, certified by or endorsed by the tools and companies listed. Product names, logos and trademarks belong to their respective owners.</p></section>
    <section><h2>Commercial relationships</h2><p>Some listings or articles may be paid, sponsored or contain affiliate links. These relationships should be disclosed on the relevant page. Payment does not guarantee a positive opinion, rating, recommendation, traffic or search-engine result.</p></section>
    <section><h2>Reviews and research</h2><p>A page labelled as a hands-on review should describe the testing performed. Other tool profiles may be editorial overviews based on official documentation and public information. We do not claim first-hand use where it did not occur.</p></section>
    <section><h2>External links and results</h2><p>We do not control external websites and cannot guarantee their content, security or service. Software outcomes vary by setup, data, team and use case; past or described results are not a promise of future performance.</p></section>
  </InfoPage>;
}

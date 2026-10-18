import InfoPage from '../../components/InfoPage';

export const metadata = { title: 'About Us', description: 'Learn why AgencyToolGuide exists, how we research software and how the directory is funded.', alternates: { canonical: '/about/' } };

export default function AboutPage() {
  return <InfoPage eyebrow="About AgencyToolGuide" title="Practical software discovery, without the noise." intro="AgencyToolGuide helps small agencies and marketing teams understand software options, compare recurring workflows and continue their research with more confidence.">
    <section><h2>Why we built this directory</h2><p>Software discovery is often slowed down by vague descriptions, outdated pricing and lists designed only to generate clicks. We organise tools by their primary job and relevant subcategories so visitors can create a useful shortlist faster.</p></section>
    <section><h2>What we publish</h2><p>Our directory includes tool profiles, category pages, feature overviews, pricing context and editorial guides. A profile may be based on official product documentation and other publicly available sources. When we have not personally tested a tool, we do not present the page as a hands-on review.</p></section>
    <section><h2>How we make money</h2><p>AgencyToolGuide may earn revenue from paid submissions, sponsored placements, advertising or affiliate relationships. Payment does not guarantee a positive opinion, rating, search position or traffic. Commercial relationships should be labelled where they could influence a reader’s decision.</p></section>
    <section><h2>Our commitment</h2><ul><li>Clearly separate verified facts from editorial judgement.</li><li>Link to official vendor websites so readers can confirm current information.</li><li>Correct material errors when they are reported or discovered.</li><li>Avoid invented testing claims, fake authors or guaranteed performance claims.</li></ul></section>
  </InfoPage>;
}

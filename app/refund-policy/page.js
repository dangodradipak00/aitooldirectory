import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: { absolute: 'Refund Policy | FreemiumAITools' }, description: 'Understand the FreemiumAITools refund policy: when you are eligible, how to request a refund, what is covered and how long the process usually takes to finish.', alternates: { canonical: '/refund-policy/' } };

export default function RefundPolicyPage() {
  return <InfoPage eyebrow="Payments" title="Refund Policy" effective="October 22, 2026">
    <section><h2>All payments are final</h2><p>All payments to FreemiumAITools for paid services, such as paid listings, featured or sponsored placements and editorial profile services, are final and non-refundable. We do not give refunds once payment has been made. Browsing the Website, reading the blog and submitting a tool for review are free unless we tell you otherwise in writing.</p></section>
    <section><h2>How payment works</h2><p>There is currently no online checkout. After you submit a tool, we review it and email you. We then agree on the scope, price, payment method (for example invoice or bank transfer), deliverables and timing by email, and you pay separately. What we confirm by email is part of our agreement with you.</p></section>
    <section><h2>Examples of what is not refunded</h2><p>No refund is given for reasons such as:</p><ul><li>A change of mind, before or after work has started.</li><li>Not receiving traffic, leads, sales, backlinks or search rankings, since none of these are promised.</li><li>Changes to your own product, pricing or website.</li><li>Delays caused by missing, late or inaccurate information from you.</li><li>Content that we decide not to publish, or that we remove, because it breaks our Terms and Conditions or editorial guidelines.</li><li>Dissatisfaction with the result of a paid service that was delivered as agreed.</li></ul></section>
    <section><h2>Before you pay</h2><p>Because payments are final, please read the scope, price and deliverables in our email carefully, and ask us any questions before you pay. We are happy to clarify anything first.</p></section>
    <section><h2>Where the law requires otherwise</h2><p>This policy does not take away any rights that the law in your state or country says cannot be waived.</p></section>
    <section><h2>Payment disputes</h2><p>If you have a concern about a payment, please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> first so we can try to sort it out before you contact your bank or payment provider.</p></section>
    <section><h2>Changes and contact</h2><p>We may update this policy, and changes apply to services agreed after the “Last updated” date. We will update it if an online payment system is added. Questions: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></section>
  </InfoPage>;
}

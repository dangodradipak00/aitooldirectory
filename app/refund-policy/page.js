import InfoPage, { contactEmail } from '../../components/InfoPage';

export const metadata = { title: 'Refund Policy', description: 'Refund and cancellation rules for AgencyToolGuide paid submissions and editorial services.', alternates: { canonical: '/refund-policy/' } };

export default function RefundPolicyPage() {
  return <InfoPage eyebrow="Payments" title="Refund Policy" intro="This policy applies to paid tool submissions and editorial services purchased directly from AgencyToolGuide.">
    <section><h2>Before work begins</h2><p>You may request cancellation and a full refund before editorial or listing work has started. Send the request promptly from the email used for the order and include the tool name and payment reference.</p></section>
    <section><h2>After work has started</h2><p>Once research, writing, design or listing setup has started, fees are normally non-refundable because time has already been allocated. If we cannot deliver the purchased service, we will offer a reasonable correction, replacement delivery or refund for the undelivered portion.</p></section>
    <section><h2>Rejection and removal</h2><p>If we reject a submission before starting the paid work, the submission fee will be refunded. A later request to remove a correctly delivered listing does not normally create a refund right. We may remove deceptive, unlawful, unsafe or materially changed tools without refund where the submitter violated these terms.</p></section>
    <section><h2>Duplicate or accidental payments</h2><p>Contact us as soon as possible about a duplicate charge or payment error. Verified duplicate payments will be refunded to the original payment method.</p></section>
    <section><h2>How to request a refund</h2><p>Email <a href={`mailto:${contactEmail}?subject=Refund%20request`}>{contactEmail}</a> with the subject “Refund request”. Include your name, order email, tool name, transaction reference and reason. Approved refunds are sent to the original payment method; processing time depends on the payment provider.</p></section>
    <section><h2>Consumer rights</h2><p>This policy does not limit mandatory refund or cancellation rights that apply under local consumer law. The final checkout should display any service-specific terms before payment.</p></section>
  </InfoPage>;
}

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: January 1, 2024</p>
      <div className="space-y-6 text-gray-600">
        {[
          ['Acceptance of Terms', 'By accessing and using PetStore, you accept and agree to be bound by these Terms and Conditions. If you disagree, please do not use our service.'],
          ['Pet Purchase Policy', 'All pet sales are final once the pet leaves our care. We provide a 7-day health guarantee. Any pre-existing conditions identified by a vet within 7 days may qualify for a refund.'],
          ['Service Appointments', 'Appointments must be cancelled at least 24 hours in advance. Late cancellations may incur a 50% fee. No-shows will be charged the full service amount.'],
          ['User Accounts', 'You are responsible for maintaining the security of your account. Do not share credentials. We reserve the right to terminate accounts that violate our policies.'],
          ['Product Returns', 'Unopened products in original packaging may be returned within 30 days for a full refund. Food and medicine items are non-returnable once opened.'],
          ['Limitation of Liability', 'PetStore is not liable for indirect or consequential damages arising from use of our services. Our liability is limited to the amount paid for the specific product or service.'],
          ['Governing Law', 'These terms are governed by the laws of the State. Disputes shall be resolved through binding arbitration.'],
        ].map(([title, text]) => (
          <section key={title}>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="leading-relaxed">{text}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

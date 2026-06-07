export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: January 1, 2024</p>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        {[
          ['Information We Collect', 'We collect information you provide directly: name, email, phone number, address, and payment information. We also collect data automatically through cookies and usage analytics.'],
          ['How We Use Your Information', 'We use your information to process orders and appointments, send notifications, improve our services, and communicate updates and promotions (with your consent).'],
          ['Information Sharing', 'We do not sell your personal data. We share data with payment processors (Stripe), delivery partners, and veterinary services strictly to fulfill your orders.'],
          ['Data Security', 'We implement industry-standard SSL encryption, secure password hashing, and regular security audits to protect your data.'],
          ['Your Rights', 'You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.'],
          ['Cookies', 'We use cookies for session management and analytics. You can control cookie settings through your browser preferences.'],
          ['Contact', 'For privacy-related questions, contact us at privacy@petstore.com.'],
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

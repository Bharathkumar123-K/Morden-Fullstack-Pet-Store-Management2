import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const faqs = [
  { q: 'How do I adopt a pet?', a: 'Browse our adoption listings, submit an adoption request, and our team will review your application and contact you within 48 hours.' },
  { q: 'Are all pets vaccinated?', a: 'Yes! All pets come with up-to-date vaccinations appropriate for their species and age, along with health certificates from licensed vets.' },
  { q: 'How do I book a grooming appointment?', a: 'Log into your account, go to "Book Appointment", select a grooming service, choose your preferred date and time, and confirm your booking.' },
  { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards via Stripe, PayPal, and cash on delivery for local orders.' },
  { q: 'Can I return a pet?', a: 'We understand that circumstances can change. Contact us within 7 days of purchase to discuss return options. Pet welfare is our top priority.' },
  { q: 'Do you offer delivery for pets?', a: 'We offer safe, monitored pet delivery within the region. All transport follows strict animal welfare guidelines.' },
  { q: 'How do I track my order?', a: 'Log in to your account and visit "My Orders" to see real-time status updates for all your purchases.' },
  { q: 'What are your store hours?', a: 'We are open Monday–Saturday 9AM–7PM and Sunday 10AM–5PM. Our online store is available 24/7.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500">Everything you need to know about PetStore</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
              {open === i ? <FiChevronUp className="text-primary-600 shrink-0" /> : <FiChevronDown className="text-gray-400 shrink-0" />}
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 animate-fade-in">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

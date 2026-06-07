import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            [FiMapPin, 'Visit Us', '123 Pet Street, Animal City, AC 12345'],
            [FiPhone, 'Call Us', '+1 (555) 123-4567\nMon-Sat: 9AM – 7PM'],
            [FiMail, 'Email Us', 'hello@petstore.com\nsupport@petstore.com'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="text-primary-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm whitespace-pre-line">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Name</label>
                <input className="input" placeholder="John Doe" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="john@example.com" value={form.email} onChange={set('email')} required />
              </div>
            </div>
            <div>
              <label className="label">Subject</label>
              <input className="input" placeholder="How can we help?" value={form.subject} onChange={set('subject')} required />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input" rows={5} placeholder="Write your message..." value={form.message} onChange={set('message')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSend /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

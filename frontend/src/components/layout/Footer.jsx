import { Link } from 'react-router-dom'
import { MdPets } from 'react-icons/md'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    // Mock subscription
    alert('Thank you for subscribing to our newsletter!')
  }

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Column 1: Brand */}
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-2.5 text-white font-black text-2xl tracking-tight font-display mb-4">
            <div className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
              <MdPets className="text-xl" />
            </div>
            <span>PetStore</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mb-6">
            Your trusted partner for all pet needs. We provide high-quality pets, premium pet accessories, professional grooming, and dedicated veterinary support.
          </p>
          <div className="flex gap-3">
            {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 bg-slate-900 hover:bg-primary-600 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <Icon className="text-base" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-2">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Shop & Care</h4>
          <ul className="space-y-3 text-sm">
            {[['Home', '/'], ['Available Pets', '/pets'], ['Pet Products', '/products'], ['Our Services', '/services'], ['About Us', '/about']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="md:col-span-2">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Support & Info</h4>
          <ul className="space-y-3 text-sm">
            {[['FAQs', '/faq'], ['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter & Contact */}
        <div className="md:col-span-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Stay Connected</h4>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Subscribe to get special discounts, free pet care tips, and updates on new pet arrivals.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              className="bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all duration-300 w-full"
            />
            <button 
              type="submit" 
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 flex items-center justify-center transition-all shadow-md shadow-primary-600/10 hover:shadow-primary-600/20"
            >
              <FiSend className="text-sm" />
            </button>
          </form>
          <ul className="space-y-3.5 text-xs text-slate-400">
            <li className="flex items-center gap-2.5"><FiMapPin className="text-primary-500 text-sm shrink-0" /> 123 Pet Street, Animal City</li>
            <li className="flex items-center gap-2.5"><FiPhone className="text-primary-500 text-sm shrink-0" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2.5"><FiMail className="text-primary-500 text-sm shrink-0" /> hello@petstore.com</li>
          </ul>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PetStore. Crafted for animal lovers everywhere. All rights reserved.
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { MdPets } from 'react-icons/md'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <MdPets className="text-primary-400 text-2xl" /> PetStore
          </Link>
          <p className="text-sm leading-relaxed">Your trusted partner for all pet needs. Quality pets, products, and services.</p>
          <div className="flex gap-3 mt-4">
            {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['Home', '/'], ['Pets', '/pets'], ['Products', '/products'], ['Services', '/services'], ['About Us', '/about']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            {[['FAQ', '/faq'], ['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><FiMapPin className="text-primary-400 shrink-0" /> 123 Pet Street, Animal City</li>
            <li className="flex items-center gap-2"><FiPhone className="text-primary-400 shrink-0" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><FiMail className="text-primary-400 shrink-0" /> hello@petstore.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} PetStore. All rights reserved.
      </div>
    </footer>
  )
}

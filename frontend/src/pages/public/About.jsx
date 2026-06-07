import { FiShield, FiHeart, FiStar, FiUsers, FiAward } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <MdPets className="text-6xl mx-auto mb-4 text-primary-200" />
          <h1 className="text-5xl font-bold mb-4">About PetStore</h1>
          <p className="text-primary-200 text-xl leading-relaxed">We are passionate pet lovers dedicated to providing the best pets, products, and services to help you give your animal companions the life they deserve.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Founded in 2015, PetStore has grown from a small neighborhood shop to a comprehensive pet care destination. Our mission is to connect pets with loving families while providing exceptional care and support every step of the way.</p>
            <p className="text-gray-600 leading-relaxed">Every animal in our care receives love, proper nutrition, veterinary attention, and socialization to ensure they are healthy and ready for their new home.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['500+', 'Happy Families'], ['50+', 'Pet Breeds'], ['10+', 'Expert Staff'], ['5★', 'Average Rating']].map(([num, label]) => (
              <div key={label} className="card p-6 text-center">
                <p className="text-4xl font-bold text-primary-600 mb-1">{num}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              [FiHeart, 'Animal Welfare', 'Every pet in our care receives love, proper nutrition, and veterinary attention.'],
              [FiShield, 'Health & Safety', 'All pets are health-checked, vaccinated, and come with health certificates.'],
              [FiStar, 'Customer Excellence', 'We go above and beyond to ensure you and your pet are completely satisfied.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-2xl text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Dr. Sarah Johnson', role: 'Head Veterinarian', avatar: 'S', desc: '10+ years of veterinary experience specializing in small animals.' },
            { name: 'Mike Thompson', role: 'Store Manager', avatar: 'M', desc: 'Passionate pet lover with 8 years in pet retail management.' },
            { name: 'Emily Chen', role: 'Lead Groomer', avatar: 'E', desc: 'Certified pet groomer with expertise in all breeds.' },
          ].map(({ name, role, avatar, desc }) => (
            <div key={name} className="card p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {avatar}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
              <p className="text-primary-600 text-sm font-medium mb-2">{role}</p>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

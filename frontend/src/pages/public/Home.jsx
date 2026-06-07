import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import PetCard from '../../components/ui/PetCard'
import ProductCard from '../../components/ui/ProductCard'
import { LoadingPage } from '../../components/ui'
import { FiArrowRight, FiShield, FiHeart, FiStar, FiTruck, FiPhone } from 'react-icons/fi'
import { MdPets, MdSpa, MdLocalHospital } from 'react-icons/md'

const testimonials = [
  { name: 'Sarah M.', text: 'Amazing service! Found my perfect golden retriever here. The staff was so helpful.', rating: 5, avatar: 'S' },
  { name: 'James K.', text: 'The grooming service is top-notch. My dog always comes out looking fabulous!', rating: 5, avatar: 'J' },
  { name: 'Emily R.', text: 'Great selection of products and very competitive prices. Highly recommend!', rating: 4, avatar: 'E' },
]

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, productsRes, servicesRes] = await Promise.all([
          api.get('/pets/featured'),
          api.get('/products?limit=4&sort=-rating'),
          api.get('/services?limit=4')
        ])
        setFeaturedPets(petsRes.data.pets.slice(0, 4))
        setPopularProducts(productsRes.data.products)
        setServices(servicesRes.data.services)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingPage />

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐾</div>
          <div className="absolute top-1/2 left-1/3 text-7xl">🐾</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-24 relative">
          <div className="max-w-2xl">
            <span className="badge bg-white/20 text-white mb-4 text-sm px-3 py-1">🐾 Your Trusted Pet Store</span>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">Find Your Perfect <span className="text-yellow-300">Furry Friend</span> Today</h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">Discover a wide selection of healthy, well-cared-for pets, quality products, and professional services all in one place.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pets" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2">
                Browse Pets <FiArrowRight />
              </Link>
              <Link to="/services" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Our Services
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[['500+', 'Happy Customers'], ['50+', 'Pet Breeds'], ['10+', 'Expert Staff']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-yellow-300">{num}</p>
                  <p className="text-primary-200 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            [FiShield, 'Health Guaranteed', 'All pets come with health cert'],
            [FiTruck, 'Safe Delivery', 'Nationwide pet delivery'],
            [FiHeart, 'Expert Care', '24/7 veterinary support'],
            [FiPhone, 'Always Here', 'Dedicated customer service'],
          ].map(([Icon, title, sub]) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pets */}
      {featuredPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Pets</h2>
              <p className="text-gray-500">Our most popular and adorable companions</p>
            </div>
            <Link to="/pets" className="btn-secondary flex items-center gap-2">View All <FiArrowRight /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        </section>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Popular Products</h2>
                <p className="text-gray-500">Top-rated products for your pets</p>
              </div>
              <Link to="/products" className="btn-secondary flex items-center gap-2">Shop All <FiArrowRight /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Professional care for your beloved pets</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: MdSpa, title: 'Grooming', desc: 'Professional grooming services to keep your pet looking and feeling their best.', color: 'pink', link: '/services' },
            { icon: MdLocalHospital, title: 'Veterinary', desc: 'Comprehensive health check-ups, vaccinations, and medical care.', color: 'blue', link: '/services' },
            { icon: MdPets, title: 'Training', desc: 'Expert behavior training to help your pet become well-mannered.', color: 'orange', link: '/services' },
          ].map(({ icon: Icon, title, desc, color, link }) => (
            <Link to={link} key={title} className="card p-6 hover:shadow-md transition-all group">
              <div className={`w-14 h-14 bg-${color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`text-2xl text-${color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              <span className={`text-${color}-600 text-sm font-medium mt-3 inline-flex items-center gap-1`}>Learn More <FiArrowRight className="text-xs" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-primary-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real stories from happy pet owners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex mb-3">
                  {Array(t.rating).fill(0).map((_, i) => <FiStar key={i} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">{t.avatar}</div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your New Best Friend?</h2>
          <p className="text-primary-200 text-lg mb-8">Browse our available pets and give them a loving forever home.</p>
          <Link to="/pets" className="bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:bg-primary-50 transition-colors inline-block text-lg">
            Explore All Pets
          </Link>
        </div>
      </section>
    </div>
  )
}

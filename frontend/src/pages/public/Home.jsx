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
    <div className="overflow-hidden bg-slate-50/30">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-20 text-9xl">🐾</div>
          <div className="absolute top-1/2 left-1/3 text-7xl">🐾</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/5">
                🐾 Your Trusted Pet Companion
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-tight tracking-tight text-white">
                Find Your Perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-amber-300 to-yellow-300">
                  Furry Friend
                </span> Today
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl max-w-xl leading-relaxed">
                Discover a wide selection of healthy, well-cared-for pets, quality foods, and professional veterinary & grooming services all in one place.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/pets" className="btn-primary flex items-center gap-2 group px-8 py-3.5 shadow-lg shadow-primary-600/25">
                  Browse Pets 
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="px-8 py-3.5 rounded-xl border-2 border-white/20 hover:border-white text-white font-bold hover:bg-white/5 transition-all text-center">
                  Our Services
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                {[
                  ['500+', 'Happy Customers'],
                  ['50+', 'Pet Breeds'],
                  ['10+', 'Expert Staff']
                ].map(([num, label]) => (
                  <div key={label} className="group">
                    <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-300 group-hover:scale-105 transition-transform origin-left inline-block">
                      {num}
                    </p>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Image mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square flex items-center justify-center">
                {/* Glowing ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-amber-400 rounded-full opacity-10 animate-float" />
                {/* Visual mockup container */}
                <div className="w-[85%] h-[85%] rounded-[3rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl p-6 backdrop-blur-md relative overflow-hidden animate-float">
                  <img 
                    src="/src/assets/hero.png" 
                    alt="Happy pets" 
                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(232,93,47,0.3)] select-none hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      // Fallback image using a vector pet illustration placeholder
                      e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600";
                      e.currentTarget.className = "w-full h-full object-cover rounded-[2rem]";
                    }}
                  />
                  
                  {/* Miniature Floating Info Box */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white max-w-[200px] animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">🐶</div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Adopt Me</p>
                      <p className="text-xs font-black text-slate-800">Cooper (Golden Retriever)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar - Floating */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            [FiShield, 'Health Guaranteed', 'All pets come with health certificates', 'text-emerald-500 bg-emerald-50'],
            [FiTruck, 'Safe Delivery', 'Nationwide temperature-controlled transport', 'text-indigo-500 bg-indigo-50'],
            [FiHeart, 'Expert Care', '24/7 post-adoption veterinary support', 'text-rose-500 bg-rose-50'],
            [FiPhone, 'Always Here', 'Dedicated support for any query', 'text-amber-500 bg-amber-50'],
          ].map(([Icon, title, sub, colors]) => (
            <div key={title} className="flex items-center gap-4 group hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${colors}`}>
                <Icon className="text-xl font-bold" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pets */}
      {featuredPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-black text-primary-600 uppercase tracking-widest">Available Companions</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Meet Our Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-600 font-black">Pets</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl font-medium">Explore adorable, healthy puppies and kittens waiting for a loving home.</p>
            </div>
            <Link to="/pets" className="btn-secondary text-sm py-2.5 px-5 flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-sm">
              View All Pets <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        </section>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="bg-slate-50/60 border-y border-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-black text-primary-600 uppercase tracking-widest">Quality Essentials</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Popular Brand <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-600 font-black">Products</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl font-medium">Give your pet the best foods, accessories, and grooming essentials.</p>
              </div>
              <Link to="/products" className="btn-secondary text-sm py-2.5 px-5 flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-sm">
                Shop All Products <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-black text-primary-600 uppercase tracking-widest">Professional Support</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
            Our Dedicated <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-600 font-black">Care Services</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">From health checks to style makeovers, we have your pet covered.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: MdSpa, 
              title: 'Premium Grooming', 
              desc: 'Stylized haircuts, relaxing baths, claw trims, and ear cleaning services to keep your pet fresh and healthy.', 
              colorTheme: 'group-hover:bg-rose-500 group-hover:text-white text-rose-600 bg-rose-50 border-rose-100/30 hover:border-rose-200/50', 
              link: '/services' 
            },
            { 
              icon: MdLocalHospital, 
              title: 'Veterinary Support', 
              desc: 'Comprehensive checkups, vaccinations, diagnostics, and prescriptions from licensed veterinarian specialists.', 
              colorTheme: 'group-hover:bg-blue-500 group-hover:text-white text-blue-600 bg-blue-50 border-blue-100/30 hover:border-blue-200/50', 
              link: '/services' 
            },
            { 
              icon: MdPets, 
              title: 'Expert Obedience Training', 
              desc: 'Behavioral training, puppy socialization camps, and agility lessons directed by certified pet trainers.', 
              colorTheme: 'group-hover:bg-amber-500 group-hover:text-white text-amber-600 bg-amber-50 border-amber-100/30 hover:border-amber-200/50', 
              link: '/services' 
            },
          ].map(({ icon: Icon, title, desc, colorTheme, link }) => (
            <Link 
              to={link} 
              key={title} 
              className={`card p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group border flex flex-col justify-between ${colorTheme}`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all shadow-sm">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-xl mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
              </div>
              <span className="text-sm font-bold inline-flex items-center gap-1.5 mt-auto">
                Learn More <FiArrowRight className="text-xs group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-slate-50/20 to-slate-100/50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-black text-primary-600 uppercase tracking-widest">Happy Owners</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              What Our Customers <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-600 font-black">Say</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium mt-2">Real testimonials from happy pet owners who found their companions here.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="card p-8 bg-white border border-slate-100 shadow-sm relative group hover:shadow-md transition-all duration-300">
                {/* Large double quote indicator */}
                <span className="absolute right-6 top-6 text-slate-100 text-6xl font-black select-none pointer-events-none font-display">“</span>
                <div className="flex mb-4 gap-0.5">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <FiStar key={i} className="text-amber-400 fill-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium italic relative z-10">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center font-bold text-base border border-primary-100/50 shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Adopter</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section as a card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl p-10 sm:p-16 text-center md:text-left md:flex items-center justify-between shadow-xl relative overflow-hidden border border-slate-800">
          {/* Blur effects */}
          <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-primary-600/30 rounded-full blur-[90px]" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[90px]" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
              Ready to Welcome a New Best Friend?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Browse our catalog of friendly and well-cared pets and start your journey of adopting your forever companion.
            </p>
          </div>
          
          <div className="relative z-10 mt-8 md:mt-0 shrink-0">
            <Link 
              to="/pets" 
              className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all text-base shadow-lg hover:shadow-xl inline-block active:scale-95"
            >
              Explore All Pets
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

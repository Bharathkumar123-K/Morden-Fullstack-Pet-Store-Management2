import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { StarRating, Badge } from '../ui'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { formatPrice } from '../../utils/currency'

export default function PetCard({ pet }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login first'); return }
    addToCart({ itemType: 'pet', petId: pet._id, name: pet.name, price: pet.price, image: pet.images?.[0], quantity: 1 })
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login first'); return }
    try {
      await api.put(`/users/wishlist/${pet._id}`)
      toast.success('Wishlist updated!')
    } catch { toast.error('Failed to update wishlist') }
  }

  return (
    <Link to={`/pets/${pet._id}`} className="card group hover:shadow-xl hover:-translate-y-1 hover:border-slate-200/80 transition-all duration-500 block relative bg-white">
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
        <img
          src={pet.images?.[0] || 'https://picsum.photos/seed/petstore-pet/600/400'}
          alt={pet.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://picsum.photos/seed/petstore-pet-fallback/600/400';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge status={pet.status} className="shadow-sm backdrop-blur-md bg-white/90 border border-white/20 font-bold" />
          {pet.isAdoption && <span className="badge bg-purple-500 text-white shadow-sm font-bold">Adoption</span>}
        </div>
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist} 
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-red-500 hover:text-white backdrop-blur-md rounded-xl flex items-center justify-center text-slate-700 hover:scale-105 transition-all duration-300 shadow-md border border-white/40 z-10"
        >
          <FiHeart className="text-sm font-bold" />
        </button>

        {/* Floating Quick View indicator on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <span className="bg-slate-950/70 text-white backdrop-blur-md text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/10">
            <FiEye /> View Details
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{pet.name}</h3>
          <span className="text-primary-600 font-extrabold text-lg font-display shrink-0">{formatPrice(pet.price)}</span>
        </div>
        
        <p className="text-slate-500 text-sm mb-3 font-medium flex items-center gap-1.5">
          <span>{pet.breed}</span>
          <span className="text-slate-300">•</span>
          <span>{pet.age}</span>
          <span className="text-slate-300">•</span>
          <span>{pet.gender}</span>
        </p>
        
        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rating={pet.rating} />
          <span className="text-xs text-slate-400 font-semibold">({pet.numReviews} reviews)</span>
        </div>
        
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {pet.isVaccinated && <span className="px-2.5 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100/50">Vaccinated</span>}
          {pet.isMicrochipped && <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100/50">Microchipped</span>}
        </div>
        
        {pet.status === 'available' ? (
          <button 
            onClick={handleAddToCart} 
            className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2 rounded-xl shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95 transition-all"
          >
            <FiShoppingCart /> Add to Cart
          </button>
        ) : (
          <button 
            disabled 
            className="w-full bg-slate-100 text-slate-400 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            Not Available
          </button>
        )}
      </div>
    </Link>
  )
}

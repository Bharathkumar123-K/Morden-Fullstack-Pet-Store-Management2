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
    <Link to={`/pets/${pet._id}`} className="card group hover:shadow-md transition-all duration-300 block">
      <div className="relative overflow-hidden">
        <img src={pet.images?.[0] || 'https://via.placeholder.com/300x200'} alt={pet.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge status={pet.status} />
          {pet.isAdoption && <span className="badge bg-purple-100 text-purple-800">Adoption</span>}
        </div>
        <button onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
          <FiHeart className="text-sm" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
          <span className="text-primary-600 font-bold text-lg">{formatPrice(pet.price)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-2">{pet.breed} • {pet.age} • {pet.gender}</p>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={pet.rating} />
          <span className="text-xs text-gray-400">({pet.numReviews})</span>
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {pet.isVaccinated && <span className="badge bg-green-50 text-green-700 text-xs">Vaccinated</span>}
          {pet.isMicrochipped && <span className="badge bg-blue-50 text-blue-700 text-xs">Microchipped</span>}
        </div>
        {pet.status === 'available' && (
          <button onClick={handleAddToCart} className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2">
            <FiShoppingCart /> Add to Cart
          </button>
        )}
      </div>
    </Link>
  )
}

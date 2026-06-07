import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { StarRating } from '../ui'
import { FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = () => {
    if (!user) { toast.error('Please login first'); return }
    if (product.stock === 0) { toast.error('Out of stock'); return }
    addToCart({ itemType: 'product', productId: product._id, name: product.name, price: product.salePrice || product.price, image: product.images?.[0], quantity: 1 })
  }

  const price = product.salePrice || product.price

  return (
    <div className="card group hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden">
        <img src={product.images?.[0] || 'https://via.placeholder.com/300x200'} alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.salePrice && (
          <span className="absolute top-3 left-3 badge bg-red-100 text-red-700">Sale</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-primary-600 font-bold text-lg">{formatPrice(price)}</span>
            {product.salePrice && <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>}
          </div>
          <span className={`text-xs ${product.stock < 10 ? 'text-orange-600' : 'text-gray-400'}`}>
            {product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
          </span>
        </div>
        <button onClick={handleAddToCart} disabled={product.stock === 0}
          className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2">
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  )
}

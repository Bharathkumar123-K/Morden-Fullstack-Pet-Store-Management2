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
    <div className="card group hover:shadow-xl hover:-translate-y-1 hover:border-slate-200/80 transition-all duration-500 relative bg-white flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
          <img
            src={product.images?.[0] || 'https://picsum.photos/seed/petstore-prod/600/400'}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://picsum.photos/seed/petstore-prod-fallback/600/400';
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Sale Badge */}
          {product.salePrice && (
            <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-rose-500 text-white rounded-lg shadow-md">
              Sale
            </span>
          )}
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="text-white bg-slate-950/80 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase border border-white/10 shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.brand}</p>
          <h3 className="font-display font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
          
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-slate-400 font-semibold">({product.numReviews})</span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-primary-600 font-extrabold text-xl font-display">{formatPrice(price)}</span>
              {product.salePrice && (
                <span className="text-slate-400 line-through text-xs font-medium">{formatPrice(product.price)}</span>
              )}
            </div>
            {product.stock > 0 && (
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                product.stock < 10 
                  ? 'bg-amber-50 text-amber-700 border border-amber-100/50' 
                  : 'bg-green-50 text-green-700 border border-green-100/50'
              }`}>
                {product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 pt-0">
        {product.stock > 0 ? (
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
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}

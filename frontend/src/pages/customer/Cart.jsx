import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { EmptyState } from '../../components/ui'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const tax = cartTotal * 0.08
  const shipping = cartTotal > 1000 ? 0 : 150
  const total = cartTotal + tax + shipping

  if (cart.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <EmptyState icon="🛒" title="Your cart is empty" description="Browse our pets and products to find something you love!"
        action={<Link to="/pets" className="btn-primary">Browse Pets</Link>} />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const id = item.petId || item.productId
            return (
              <div key={id} className="card p-4 flex items-center gap-4">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{item.itemType}</p>
                  <p className="text-primary-600 font-bold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.itemType === 'product' ? (
                    <>
                      <button onClick={() => updateQuantity(id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <FiPlus className="text-xs" />
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Qty: 1</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(id)} className="text-red-400 hover:text-red-600 mt-1">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h2 className="font-bold text-gray-900 text-xl mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-gray-400">Free shipping on orders over {formatPrice(1000)}</p>}
            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2">
            <FiShoppingBag /> Proceed to Checkout
          </button>
          <Link to="/pets" className="w-full text-center block mt-3 text-sm text-gray-500 hover:text-primary-600">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

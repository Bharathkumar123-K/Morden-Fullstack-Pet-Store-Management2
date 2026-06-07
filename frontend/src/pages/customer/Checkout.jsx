import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiCheck } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'India' })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [notes, setNotes] = useState('')

  const setAddr = (k) => (e) => setAddress(a => ({ ...a, [k]: e.target.value }))
  const tax = cartTotal * 0.08
  const shipping = cartTotal > 1000 ? 0 : 150
  const total = cartTotal + tax + shipping

  const placeOrder = async () => {
    setLoading(true)
    try {
      const items = cart.map(item => item.itemType === 'pet'
        ? { itemType: 'pet', petId: item.petId }
        : { itemType: 'product', productId: item.productId, quantity: item.quantity }
      )
      const { data } = await api.post('/orders', { items, shippingAddress: address, paymentMethod, notes })
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally { setLoading(false) }
  }

  if (cart.length === 0) { navigate('/cart'); return null }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-10">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-primary-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 < step ? 'bg-primary-600 text-white' : i + 1 === step ? 'border-2 border-primary-600 text-primary-600' : 'border-2 border-gray-200 text-gray-300'}`}>
                {i + 1 < step ? <FiCheck /> : i + 1}
              </div>
              <span className="font-medium text-sm hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${i + 1 < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-bold text-xl text-gray-900 mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Street Address</label>
                  <input className="input" placeholder="123 Main St" value={address.street} onChange={setAddr('street')} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input className="input" placeholder="New York" value={address.city} onChange={setAddr('city')} required />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input className="input" placeholder="NY" value={address.state} onChange={setAddr('state')} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">ZIP Code</label>
                    <input className="input" placeholder="10001" value={address.zip} onChange={setAddr('zip')} required />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input className="input" value={address.country} onChange={setAddr('country')} />
                  </div>
                </div>
                <div>
                  <label className="label">Order Notes (optional)</label>
                  <textarea className="input" rows={2} placeholder="Any special instructions..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
              <button onClick={() => {
                if (!address.street || !address.city || !address.zip) { toast.error('Please fill in required fields'); return }
                setStep(2)
              }} className="btn-primary mt-6 w-full py-3">Continue to Payment</button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-bold text-xl text-gray-900 mb-5">Payment Method</h2>
              <div className="space-y-3">
                {[['cod', '💵 Cash on Delivery', 'Pay when you receive your order'],
                  ['stripe', '💳 Credit/Debit Card', 'Secure payment via Stripe'],
                ].map(([val, label, desc]) => (
                  <label key={val} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === val ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={e => setPaymentMethod(e.target.value)} className="mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-bold text-xl text-gray-900 mb-5">Review Your Order</h2>
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <div key={item.petId || item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 mb-5">
                <p><strong>Ship to:</strong> {address.street}, {address.city}, {address.state} {address.zip}</p>
                <p><strong>Payment:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 py-3">{loading ? 'Placing Order...' : 'Place Order'}</button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Summary ({cart.length} items)</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

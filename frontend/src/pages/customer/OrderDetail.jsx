import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { LoadingPage, Badge } from '../../components/ui'
import { FiArrowLeft, FiPackage, FiTruck, FiCheck } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingPage />
  if (!order) return null

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6">
        <FiArrowLeft /> Back to Orders
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Badge status={order.status} />
          <Badge status={order.paymentStatus} />
        </div>
      </div>

      {/* Progress */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-5">Order Progress</h2>
          <div className="flex items-center">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < currentStep ? <FiCheck /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 capitalize ${i <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>{step}</span>
                </div>
                {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{item.itemType} • Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
                <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 capitalize">Method: {order.paymentMethod}</p>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FiTruck /> Shipping To</h3>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

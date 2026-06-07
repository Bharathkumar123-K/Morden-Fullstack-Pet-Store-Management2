import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { LoadingPage, Badge, EmptyState } from '../../components/ui'
import { FiEye } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/myorders').then(r => setOrders(r.data.orders)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" description="Start shopping to see your orders here"
          action={<Link to="/pets" className="btn-primary">Browse Pets</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={order.status} />
                  <Badge status={order.paymentStatus} />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                    {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />}
                    <span className="text-sm text-gray-700">{item.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-gray-400">x{item.quantity}</span>}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-900 text-lg">{formatPrice(order.totalPrice)}</p>
                <Link to={`/orders/${order._id}`} className="btn-outline text-sm flex items-center gap-2 py-1.5">
                  <FiEye /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

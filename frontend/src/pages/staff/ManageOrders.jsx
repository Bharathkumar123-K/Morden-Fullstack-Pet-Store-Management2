import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, Pagination, EmptyState } from '../../components/ui'
import { FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(statusFilter && { status: statusFilter }) })
      const { data } = await api.get(`/orders?${params}`)
      setOrders(data.orders)
      setPages(data.pages)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const openOrder = async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}`)
      setSelectedOrder(data.order)
      setNewStatus(data.order.status)
      setShowModal(true)
    } catch { toast.error('Failed') }
  }

  const updateStatus = async () => {
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status: newStatus })
      toast.success('Status updated')
      setShowModal(false)
      fetchOrders()
    } catch { toast.error('Update failed') }
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Process Orders</h1>

        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? <LoadingPage /> : orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders found" />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-semibold text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{order.customer?.name}</p>
                          <p className="text-xs text-gray-400">{order.customer?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{order.items?.length}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.totalPrice)}</td>
                        <td className="px-4 py-3"><Badge status={order.status} /></td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => openOrder(order._id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEye /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Order Details" size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-400">{selectedOrder.customer?.name} · {selectedOrder.customer?.email}</p>
              </div>
              <Badge status={selectedOrder.status} />
            </div>
            <div className="space-y-2">
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={item.image || 'https://via.placeholder.com/40'} className="w-10 h-10 object-cover rounded-lg" alt={item.name} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.itemType} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p><strong>Ship to:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
              <p className="mt-1"><strong>Total:</strong> {formatPrice(selectedOrder.totalPrice)} · <strong>Payment:</strong> {selectedOrder.paymentMethod?.toUpperCase()}</p>
            </div>
            <div className="flex items-end gap-3 border-t pt-4">
              <div className="flex-1">
                <label className="label">Update Status</label>
                <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={updateStatus} className="btn-primary px-6 py-2.5">Update</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

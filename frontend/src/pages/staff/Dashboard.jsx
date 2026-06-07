import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge } from '../../components/ui'
import { FiShoppingBag, FiCalendar, FiPackage, FiAlertTriangle } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'
import { formatPrice } from '../../utils/currency'

export default function StaffDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout role="staff"><LoadingPage /></DashboardLayout>

  const { stats, recentOrders, recentAppointments, lowStockProducts } = data

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage daily operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pets', value: stats.totalPets, icon: MdPets, cls: 'bg-orange-100 text-orange-600' },
            { label: 'Products', value: stats.totalProducts, icon: FiPackage, cls: 'bg-blue-100 text-blue-600' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: FiShoppingBag, cls: 'bg-yellow-100 text-yellow-600' },
            { label: "Today's Appts", value: stats.todayAppointments, icon: FiCalendar, cls: 'bg-green-100 text-green-600' },
          ].map(({ label, value, icon: Icon, cls }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls}`}>
                  <Icon className="text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/staff/orders" className="text-primary-600 text-sm">View all</Link>
            </div>
            <div className="space-y-3">
              {recentOrders?.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">No recent orders</p> :
                recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{order.customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{formatPrice(order.totalPrice)}</span>
                      <Badge status={order.status} />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Appointments</h2>
              <Link to="/staff/appointments" className="text-primary-600 text-sm">View all</Link>
            </div>
            <div className="space-y-3">
              {recentAppointments?.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">No appointments</p> :
                recentAppointments?.map(apt => (
                  <div key={apt._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{apt.service?.name}</p>
                      <p className="text-xs text-gray-400">{apt.customer?.name} · {apt.timeSlot}</p>
                    </div>
                    <Badge status={apt.status} />
                  </div>
                ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="text-orange-500" /> Low Stock Products
              </h2>
              <Link to="/staff/products" className="text-primary-600 text-sm">Manage Stock</Link>
            </div>
            {lowStockProducts?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">All products well stocked!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {lowStockProducts?.map(p => (
                  <div key={p._id} className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                    <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                    <p className="text-orange-600 font-bold text-lg">{p.stock}</p>
                    <p className="text-xs text-gray-400">remaining</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

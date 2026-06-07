import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge } from '../../components/ui'
import { FiUsers, FiShoppingBag, FiCalendar, FiDollarSign, FiPackage, FiAlertTriangle } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout role="admin"><LoadingPage /></DashboardLayout>

  const { stats, revenueData, recentOrders, recentAppointments, lowStockProducts } = data
  const chartData = revenueData.map(d => ({ month: MONTHS[d._id - 1], revenue: d.revenue, orders: d.orders }))

  const statCards = [
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(0)}`, icon: FiDollarSign, bg: 'bg-green-100', text: 'text-green-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, bg: 'bg-blue-100', text: 'text-blue-600' },
    { label: 'Customers', value: stats.totalUsers, icon: FiUsers, bg: 'bg-purple-100', text: 'text-purple-600' },
    { label: 'Total Pets', value: stats.totalPets, icon: MdPets, bg: 'bg-orange-100', text: 'text-orange-600' },
    { label: 'Products', value: stats.totalProducts, icon: FiPackage, bg: 'bg-pink-100', text: 'text-pink-600' },
    { label: 'Appointments', value: stats.totalAppointments, icon: FiCalendar, bg: 'bg-teal-100', text: 'text-teal-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: FiAlertTriangle, bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { label: "Today's Appts", value: stats.todayAppointments, icon: FiCalendar, bg: 'bg-indigo-100', text: 'text-indigo-600' },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your pet store performance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className={`text-xl ${text}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#c94a22" fill="#fde6dd" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary-600 text-sm">View all</Link>
            </div>
            <div className="space-y-3">
              {recentOrders?.length === 0
                ? <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>
                : recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{order.customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">${order.totalPrice?.toFixed(2)}</span>
                      <Badge status={order.status} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="text-orange-500" /> Low Stock Alert
              </h2>
              <Link to="/admin/products" className="text-primary-600 text-sm">Manage</Link>
            </div>
            {lowStockProducts?.length === 0
              ? <p className="text-gray-400 text-sm py-4 text-center">All products well stocked!</p>
              : <div className="space-y-3">
                {lowStockProducts?.map(p => (
                  <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="font-medium text-sm text-gray-900">{p.name}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            }
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Appointments</h2>
              <Link to="/admin/appointments" className="text-primary-600 text-sm">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Customer', 'Service', 'Date', 'Time', 'Status'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments?.map(apt => (
                    <tr key={apt._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-gray-900">{apt.customer?.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{apt.service?.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-gray-500">{apt.timeSlot}</td>
                      <td className="py-3"><Badge status={apt.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

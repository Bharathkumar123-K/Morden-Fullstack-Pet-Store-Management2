import { FiStar } from 'react-icons/fi'
import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md'

export const StarRating = ({ rating, size = 'sm' }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars.push(<MdStar key={i} className="text-yellow-400" />)
    else if (i - 0.5 <= rating) stars.push(<MdStarHalf key={i} className="text-yellow-400" />)
    else stars.push(<MdStarOutline key={i} className="text-gray-300" />)
  }
  return <div className={`flex ${size === 'sm' ? 'text-sm' : 'text-lg'}`}>{stars}</div>
}

export const Badge = ({ status, className = '' }) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    adoption: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    customer: 'bg-blue-100 text-blue-800',
    staff: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    grooming: 'bg-pink-100 text-pink-800',
    veterinary: 'bg-blue-100 text-blue-800',
    training: 'bg-orange-100 text-orange-800',
    boarding: 'bg-teal-100 text-teal-800',
  }
  return (
    <span className={`badge ${colors[status] || 'bg-gray-100 text-gray-800'} ${className}`}>
      {status}
    </span>
  )
}

export const Spinner = ({ size = 'md' }) => (
  <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary-600 ${size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'}`} />
)

export const LoadingPage = () => (
  <div className="flex items-center justify-center min-h-64">
    <Spinner size="lg" />
  </div>
)

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="text-center py-16">
    {icon && <div className="text-6xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-6">{description}</p>}
    {action}
  </div>
)

export const StatCard = ({ title, value, icon: Icon, color = 'primary', change }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {change && <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>{change > 0 ? '+' : ''}{change}% this month</p>}
      </div>
      <div className={`w-14 h-14 bg-${color}-100 rounded-2xl flex items-center justify-center`}>
        <Icon className={`text-2xl text-${color}-600`} />
      </div>
    </div>
  </div>
)

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto ${size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : 'max-w-lg'} animate-fade-in`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
          {p}
        </button>
      ))}
    </div>
  )
}

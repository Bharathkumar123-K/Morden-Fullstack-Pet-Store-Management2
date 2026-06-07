import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, EmptyState, StarRating } from '../../components/ui'
import { FiCheck, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reviews')
      setReviews(data.reviews)
    } catch { toast.error('Failed to load reviews') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`)
      toast.success('Review approved')
      fetchReviews()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await api.delete(`/reviews/${id}`)
      toast.success('Review deleted')
      fetchReviews()
    } catch { toast.error('Failed') }
  }

  const filtered = filter === 'all' ? reviews : filter === 'approved' ? reviews.filter(r => r.isApproved) : reviews.filter(r => !r.isApproved)

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>

        <div className="flex gap-2">
          {['all', 'approved', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <LoadingPage /> : filtered.length === 0 ? (
          <EmptyState icon="⭐" title="No reviews found" />
        ) : (
          <div className="space-y-4">
            {filtered.map(review => (
              <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()} · <span className="capitalize">{review.itemType}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {!review.isApproved && (
                      <button onClick={() => handleApprove(review._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                        <FiCheck />
                      </button>
                    )}
                    <button onClick={() => handleDelete(review._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

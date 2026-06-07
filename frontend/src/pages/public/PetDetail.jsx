import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { LoadingPage, Badge, StarRating } from '../../components/ui'
import { FiShoppingCart, FiHeart, FiCheck, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const [petRes, reviewsRes] = await Promise.all([
          api.get(`/pets/${id}`),
          api.get(`/reviews?itemType=pet&itemId=${id}`)
        ])
        setPet(petRes.data.pet)
        setReviews(reviewsRes.data.reviews)
      } catch { navigate('/pets') }
      finally { setLoading(false) }
    }
    fetchPet()
  }, [id])

  const handleAddToCart = () => {
    if (!user) { toast.error('Please login first'); return }
    addToCart({ itemType: 'pet', petId: pet._id, name: pet.name, price: pet.price, image: pet.images?.[0], quantity: 1 })
  }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return }
    await api.put(`/users/wishlist/${pet._id}`)
    toast.success('Wishlist updated!')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    try {
      await api.post('/reviews', { itemType: 'pet', itemId: pet._id, ...reviewForm })
      toast.success('Review submitted for approval!')
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review') }
  }

  if (loading) return <LoadingPage />
  if (!pet) return null

  const features = [
    { label: 'Vaccinated', value: pet.isVaccinated },
    { label: 'Microchipped', value: pet.isMicrochipped },
    { label: 'Neutered', value: pet.isNeutered },
    { label: 'Health Certificate', value: pet.healthCertificate },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden mb-3 bg-gray-100">
            <img src={pet.images?.[selectedImage] || 'https://via.placeholder.com/500'} alt={pet.name} className="w-full h-96 object-cover" />
          </div>
          {pet.images?.length > 1 && (
            <div className="flex gap-2">
              {pet.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary-500' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">{pet.name}</h1>
            <span className="text-3xl font-bold text-primary-600">{formatPrice(pet.price)}</span>
          </div>
          <p className="text-gray-500 mb-3">{pet.breed} • {pet.age} • {pet.gender} • {pet.color}</p>
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={pet.rating} size="lg" />
            <span className="text-gray-500 text-sm">({pet.numReviews} reviews)</span>
            <Badge status={pet.status} />
            {pet.isAdoption && <Badge status="adoption" />}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{pet.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[['Category', pet.category?.name], ['Weight', pet.weight], ['Gender', pet.gender], ['Age', pet.age]].map(([k, v]) => v && (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{k}</p>
                <p className="font-semibold text-gray-800 capitalize">{v}</p>
              </div>
            ))}
          </div>

          {/* Health Features */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-3">Health & Features</p>
            <div className="grid grid-cols-2 gap-2">
              {features.map(({ label, value }) => (
                <div key={label} className={`flex items-center gap-2 text-sm p-2 rounded-lg ${value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  <FiCheck className={value ? 'text-green-600' : 'text-gray-300'} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {pet.status === 'available' && (
              <button onClick={handleAddToCart} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-base">
                <FiShoppingCart /> {pet.isAdoption ? 'Adopt Now' : 'Add to Cart'}
              </button>
            )}
            <button onClick={handleWishlist} className="btn-outline px-4 py-3">
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? <p className="text-gray-500">No reviews yet. Be the first!</p> : (
          <div className="space-y-4 mb-8">
            {reviews.map(r => (
              <div key={r._id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {r.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{r.user?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="label">Rating</label>
                <select className="input" value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: +e.target.value }))}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Comment</label>
                <textarea className="input" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import PetCard from '../../components/ui/PetCard'
import { LoadingPage, EmptyState } from '../../components/ui'
import { FiHeart } from 'react-icons/fi'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/wishlist').then(r => setWishlist(r.data.wishlist)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <FiHeart className="text-3xl text-red-500" />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{wishlist.length} items</span>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState icon="❤️" title="Your wishlist is empty"
          description="Save your favorite pets here by clicking the heart icon on any pet card"
          action={<Link to="/pets" className="btn-primary">Browse Pets</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(pet => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import api from '../../utils/api'
import PetCard from '../../components/ui/PetCard'
import { LoadingPage, Pagination, EmptyState } from '../../components/ui'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

export default function PetCatalog() {
  const [pets, setPets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filters, setFilters] = useState({ search: '', category: '', gender: '', minPrice: '', maxPrice: '', isAdoption: '' })
  const [showFilters, setShowFilters] = useState(false)

  const fetchPets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) })
      const { data } = await api.get(`/pets?${params}`)
      setPets(data.pets)
      setPages(data.pages)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.categories)) }, [])
  useEffect(() => { fetchPets() }, [page, filters])

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }
  const clearFilters = () => { setFilters({ search: '', category: '', gender: '', minPrice: '', maxPrice: '', isAdoption: '' }); setPage(1) }
  const hasFilters = Object.values(filters).some(v => v)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pet Catalog</h1>
        <p className="text-gray-500">Find your perfect furry, feathered, or scaly companion</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search by name or breed..." value={filters.search}
            onChange={e => setFilter('search', e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn-outline flex items-center gap-2 ${hasFilters ? 'border-primary-400 text-primary-600' : ''}`}>
          <FiFilter /> Filters {hasFilters && `(${Object.values(filters).filter(v => v).length})`}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-outline flex items-center gap-2 text-red-600 border-red-200">
            <FiX /> Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-6 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
          <div>
            <label className="label">Category</label>
            <select className="input" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input" value={filters.gender} onChange={e => setFilter('gender', e.target.value)}>
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="label">Min Price</label>
            <input type="number" className="input" placeholder="₹0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
          </div>
          <div>
            <label className="label">Max Price</label>
            <input type="number" className="input" placeholder="₹9999" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={filters.isAdoption} onChange={e => setFilter('isAdoption', e.target.value)}>
              <option value="">All</option>
              <option value="false">For Sale</option>
              <option value="true">For Adoption</option>
            </select>
          </div>
        </div>
      )}

      {loading ? <LoadingPage /> : pets.length === 0 ? (
        <EmptyState icon="🐾" title="No pets found" description="Try adjusting your filters" action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </div>
  )
}

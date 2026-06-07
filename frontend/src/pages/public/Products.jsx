import { useState, useEffect } from 'react'
import api from '../../utils/api'
import ProductCard from '../../components/ui/ProductCard'
import { LoadingPage, Pagination, EmptyState } from '../../components/ui'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const CATEGORIES = ['food', 'toys', 'accessories', 'medicine', 'grooming', 'other']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '' })
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) })
      const { data } = await api.get(`/products?${params}`)
      setProducts(data.products)
      setPages(data.pages)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [page, filters])

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }
  const clearFilters = () => { setFilters({ search: '', category: '', minPrice: '', maxPrice: '' }); setPage(1) }
  const hasFilters = Object.values(filters).some(v => v)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pet Products</h1>
        <p className="text-gray-500">Quality supplies for happy, healthy pets</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search products..." value={filters.search} onChange={e => setFilter('search', e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn-outline flex items-center gap-2 ${hasFilters ? 'border-primary-400 text-primary-600' : ''}`}>
          <FiFilter /> Filters
        </button>
        {hasFilters && <button onClick={clearFilters} className="btn-outline flex items-center gap-2 text-red-600 border-red-200"><FiX /> Clear</button>}
      </div>

      {/* Category Quick Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('category', '')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filters.category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter('category', c)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filters.category === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
        ))}
      </div>

      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-2 gap-4 animate-fade-in">
          <div>
            <label className="label">Min Price</label>
            <input type="number" className="input" placeholder="₹0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
          </div>
          <div>
            <label className="label">Max Price</label>
            <input type="number" className="input" placeholder="₹9999" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
          </div>
        </div>
      )}

      {loading ? <LoadingPage /> : products.length === 0 ? (
        <EmptyState icon="📦" title="No products found" description="Try adjusting your filters" action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </div>
  )
}

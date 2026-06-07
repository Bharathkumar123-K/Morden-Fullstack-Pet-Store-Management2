import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Modal, Pagination, EmptyState } from '../../components/ui'
import { FiSearch, FiEdit, FiPlus, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

const CATEGORIES = ['food', 'toys', 'accessories', 'medicine', 'grooming', 'other']
const emptyForm = { name: '', category: 'food', petType: '', brand: '', price: '', salePrice: '', stock: '', description: '', images: '' }

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }) })
      const { data } = await api.get(`/products?${params}`)
      setProducts(data.products)
      setPages(data.pages)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (p) => {
    setForm({ ...p, petType: Array.isArray(p.petType) ? p.petType.join(', ') : p.petType, images: Array.isArray(p.images) ? p.images.join(', ') : p.images, salePrice: p.salePrice || '' })
    setEditId(p._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      petType: form.petType ? form.petType.split(',').map(s => s.trim()).filter(Boolean) : [],
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      stock: Number(form.stock)
    }
    try {
      if (editId) { await api.put(`/products/${editId}`, payload); toast.success('Updated') }
      else { await api.post('/products', payload); toast.success('Added') }
      setShowModal(false)
      fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        {loading ? <LoadingPage /> : products.length === 0 ? (
          <EmptyState icon="📦" title="No products found" action={<button onClick={openAdd} className="btn-primary">Add Product</button>} />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                            <div>
                              <p className="font-medium text-gray-900">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-500">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(p.salePrice || p.price)}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium ${p.stock < 10 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {p.stock < 10 && <FiAlertTriangle />} {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name *</label><input className="input" value={form.name} onChange={set('name')} required /></div>
            <div>
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Brand</label><input className="input" value={form.brand} onChange={set('brand')} /></div>
            <div><label className="label">Pet Types (comma-sep)</label><input className="input" placeholder="dogs, cats" value={form.petType} onChange={set('petType')} /></div>
            <div><label className="label">Price *</label><input type="number" className="input" value={form.price} onChange={set('price')} required /></div>
            <div><label className="label">Sale Price</label><input type="number" className="input" value={form.salePrice} onChange={set('salePrice')} /></div>
            <div><label className="label">Stock *</label><input type="number" className="input" value={form.stock} onChange={set('stock')} required /></div>
          </div>
          <div><label className="label">Description *</label><textarea className="input" rows={2} value={form.description} onChange={set('description')} required /></div>
          <div><label className="label">Image URLs (comma-separated)</label><input className="input" value={form.images} onChange={set('images')} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

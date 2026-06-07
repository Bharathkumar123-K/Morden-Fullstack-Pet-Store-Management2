import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, Pagination, EmptyState } from '../../components/ui'
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

const emptyForm = { name: '', category: '', breed: '', age: '', gender: 'male', color: '', weight: '', price: '', description: '', images: '', status: 'available', isVaccinated: false, isMicrochipped: false, isNeutered: false, healthCertificate: false, isAdoption: false }

export default function AdminPets() {
  const [pets, setPets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchPets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }) })
      const { data } = await api.get(`/pets?${params}`)
      setPets(data.pets)
      setPages(data.pages)
    } catch { toast.error('Failed to load pets') }
    finally { setLoading(false) }
  }

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.categories)) }, [])
  useEffect(() => { fetchPets() }, [page, search])

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (pet) => {
    setForm({ ...pet, category: pet.category?._id || pet.category, images: Array.isArray(pet.images) ? pet.images.join(', ') : pet.images })
    setEditId(pet._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [] }
    try {
      if (editId) { await api.put(`/pets/${editId}`, payload); toast.success('Pet updated') }
      else { await api.post('/pets', payload); toast.success('Pet added') }
      setShowModal(false)
      fetchPets()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pet?')) return
    try { await api.delete(`/pets/${id}`); toast.success('Deleted'); fetchPets() }
    catch { toast.error('Failed') }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Pets</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2"><FiPlus /> Add Pet</button>
        </div>

        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search pets..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        {loading ? <LoadingPage /> : pets.length === 0 ? (
          <EmptyState icon="🐾" title="No pets found" action={<button onClick={openAdd} className="btn-primary">Add Pet</button>} />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Pet', 'Breed', 'Age', 'Price', 'Status', 'Category', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {pets.map(pet => (
                      <tr key={pet._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={pet.images?.[0] || 'https://via.placeholder.com/40'} alt={pet.name} className="w-10 h-10 object-cover rounded-lg" />
                            <span className="font-medium text-gray-900">{pet.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{pet.breed}</td>
                        <td className="px-4 py-3 text-gray-500">{pet.age}</td>
                        <td className="px-4 py-3 font-semibold text-primary-600">${pet.price}</td>
                        <td className="px-4 py-3"><Badge status={pet.status} /></td>
                        <td className="px-4 py-3 text-gray-500">{pet.category?.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(pet)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
                            <button onClick={() => handleDelete(pet._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                          </div>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Pet' : 'Add Pet'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name *</label><input className="input" value={form.name} onChange={set('name')} required /></div>
            <div>
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={set('category')} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="label">Breed *</label><input className="input" value={form.breed} onChange={set('breed')} required /></div>
            <div><label className="label">Age *</label><input className="input" placeholder="2 years" value={form.age} onChange={set('age')} required /></div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={set('gender')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div><label className="label">Price *</label><input type="number" className="input" value={form.price} onChange={set('price')} required /></div>
            <div><label className="label">Color</label><input className="input" value={form.color} onChange={set('color')} /></div>
            <div><label className="label">Weight</label><input className="input" placeholder="5 kg" value={form.weight} onChange={set('weight')} /></div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                {['available', 'reserved', 'sold', 'adoption'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Description *</label><textarea className="input" rows={2} value={form.description} onChange={set('description')} required /></div>
          <div><label className="label">Image URLs (comma-separated)</label><input className="input" placeholder="https://..." value={form.images} onChange={set('images')} /></div>
          <div className="flex flex-wrap gap-4 text-sm">
            {[['isVaccinated','Vaccinated'],['isMicrochipped','Microchipped'],['isNeutered','Neutered'],['healthCertificate','Health Cert'],['isAdoption','For Adoption']].map(([k,l]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[k]} onChange={set(k)} className="w-4 h-4" />
                <span>{l}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Add Pet'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

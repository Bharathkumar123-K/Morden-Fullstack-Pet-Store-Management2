import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, EmptyState } from '../../components/ui'
import { FiEdit, FiTrash2, FiPlus, FiClock, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'

const TYPES = ['grooming', 'veterinary', 'training', 'boarding']
const emptyForm = { name: '', type: 'grooming', description: '', price: '', duration: '', petTypes: '', features: '' }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/services')
      setServices(data.services)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchServices() }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (s) => {
    setForm({ ...s, petTypes: Array.isArray(s.petTypes) ? s.petTypes.join(', ') : s.petTypes || '', features: Array.isArray(s.features) ? s.features.join(', ') : s.features || '' })
    setEditId(s._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      petTypes: form.petTypes ? form.petTypes.split(',').map(s => s.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      price: Number(form.price),
      duration: Number(form.duration)
    }
    try {
      if (editId) { await api.put(`/services/${editId}`, payload); toast.success('Updated') }
      else { await api.post('/services', payload); toast.success('Created') }
      setShowModal(false)
      fetchServices()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); fetchServices() }
    catch { toast.error('Failed') }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2"><FiPlus /> Add Service</button>
        </div>

        {loading ? <LoadingPage /> : services.length === 0 ? (
          <EmptyState icon="✂️" title="No services found" action={<button onClick={openAdd} className="btn-primary">Add Service</button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => (
              <div key={s._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    <Badge status={s.type} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
                    <button onClick={() => handleDelete(s._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 font-bold text-primary-600"><FiDollarSign />{s.price}</span>
                  <span className="flex items-center gap-1 text-gray-400"><FiClock />{s.duration} min</span>
                  <span className={`text-xs font-medium ${s.isActive ? 'text-green-600' : 'text-red-500'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                {s.features?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.features.map(f => <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Service' : 'Add Service'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name *</label><input className="input" value={form.name} onChange={set('name')} required /></div>
            <div>
              <label className="label">Type *</label>
              <select className="input" value={form.type} onChange={set('type')}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="label">Price ($) *</label><input type="number" className="input" value={form.price} onChange={set('price')} required /></div>
            <div><label className="label">Duration (min) *</label><input type="number" className="input" value={form.duration} onChange={set('duration')} required /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={set('description')} /></div>
          <div><label className="label">Pet Types (comma-sep)</label><input className="input" placeholder="dogs, cats, birds" value={form.petTypes} onChange={set('petTypes')} /></div>
          <div><label className="label">Features (comma-sep)</label><input className="input" placeholder="Bath, Haircut, Nail Trim" value={form.features} onChange={set('features')} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

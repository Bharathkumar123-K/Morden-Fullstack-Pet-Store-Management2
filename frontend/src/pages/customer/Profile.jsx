import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || { street: '', city: '', state: '', zip: '', country: '' },
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setAddr = (k) => (e) => setForm(f => ({ ...f, address: { ...f.address, [k]: e.target.value } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address }
      if (form.password) payload.password = form.password
      const { data } = await api.put('/users/profile', payload)
      updateUser(data.user)
      toast.success('Profile updated successfully!')
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-4xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className="badge bg-primary-100 text-primary-700 capitalize mt-1">{user?.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><FiUser /> Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={user?.email} disabled className="input bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" />
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="input pl-10" value={form.phone} onChange={set('phone')} placeholder="+1 555-0000" />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><FiMapPin /> Address</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Street</label>
              <input className="input" value={form.address.street} onChange={setAddr('street')} placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input className="input" value={form.address.city} onChange={setAddr('city')} />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" value={form.address.state} onChange={setAddr('state')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">ZIP</label>
                <input className="input" value={form.address.zip} onChange={setAddr('zip')} />
              </div>
              <div>
                <label className="label">Country</label>
                <input className="input" value={form.address.country} onChange={setAddr('country')} />
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 py-3 px-8">
          <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

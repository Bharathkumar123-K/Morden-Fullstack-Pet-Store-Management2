import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { LoadingPage } from '../../components/ui'
import toast from 'react-hot-toast'
import { FiCalendar, FiClock } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

export default function AppointmentBooking() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [form, setForm] = useState({ serviceId: '', petName: '', petType: '', petAge: '', date: '', timeSlot: '', notes: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services))
  }, [])

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setForm(f => ({ ...f, serviceId: service._id }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.serviceId || !form.date || !form.timeSlot) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    try {
      await api.post('/appointments', {
        service: form.serviceId,
        petName: form.petName,
        petType: form.petType,
        petAge: form.petAge,
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes,
        totalPrice: selectedService?.price
      })
      toast.success('Appointment booked successfully!')
      navigate('/my-appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setLoading(false) }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-8">Schedule a grooming or veterinary appointment for your pet</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Service */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">1. Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map(service => (
              <button key={service._id} type="button" onClick={() => handleServiceSelect(service)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${selectedService?._id === service._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{service.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatPrice(service.price)}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><FiClock /> {service.duration} min</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pet Info */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">2. Your Pet's Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Pet Name *</label>
              <input className="input" placeholder="e.g. Max" value={form.petName} onChange={set('petName')} required />
            </div>
            <div>
              <label className="label">Pet Type *</label>
              <select className="input" value={form.petType} onChange={set('petType')} required>
                <option value="">Select type</option>
                {['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other'].map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Pet Age</label>
              <input className="input" placeholder="e.g. 2 years" value={form.petAge} onChange={set('petAge')} />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">3. Choose Date & Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input" min={minDateStr} value={form.date} onChange={set('date')} required />
            </div>
          </div>
          <div>
            <label className="label">Time Slot *</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button key={slot} type="button" onClick={() => setForm(f => ({ ...f, timeSlot: slot }))}
                  className={`py-2 px-2 rounded-lg text-sm font-medium border-2 transition-colors ${form.timeSlot === slot ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">4. Additional Notes</h2>
          <textarea className="input" rows={3} placeholder="Any special requirements or health concerns..." value={form.notes} onChange={set('notes')} />
        </div>

        {/* Summary */}
        {selectedService && form.date && form.timeSlot && (
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 animate-fade-in">
            <h3 className="font-bold text-primary-900 mb-3">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-primary-600 font-medium">Service:</span> <span className="text-gray-800">{selectedService.name}</span></div>
              <div><span className="text-primary-600 font-medium">Price:</span> <span className="text-gray-800">{formatPrice(selectedService.price)}</span></div>
              <div><span className="text-primary-600 font-medium">Date:</span> <span className="text-gray-800">{new Date(form.date).toLocaleDateString()}</span></div>
              <div><span className="text-primary-600 font-medium">Time:</span> <span className="text-gray-800">{form.timeSlot}</span></div>
              {form.petName && <div><span className="text-primary-600 font-medium">Pet:</span> <span className="text-gray-800">{form.petName}</span></div>}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading || !selectedService} className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
          <FiCalendar /> {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  )
}

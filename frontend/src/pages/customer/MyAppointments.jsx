import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { LoadingPage, Badge, EmptyState } from '../../components/ui'
import { FiCalendar, FiClock } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/appointments/my').then(r => setAppointments(r.data.appointments)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <Link to="/book-appointment" className="btn-primary flex items-center gap-2">
          <FiCalendar /> Book New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <EmptyState icon="📅" title="No appointments yet" description="Book a grooming or veterinary service"
          action={<Link to="/book-appointment" className="btn-primary">Book Appointment</Link>} />
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <div key={apt._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{apt.service?.name}</h3>
                  <p className="text-sm text-gray-500 capitalize mb-2">{apt.service?.type} Service</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(apt.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><FiClock /> {apt.timeSlot}</span>
                  </div>
                  {apt.petName && <p className="text-sm text-gray-500 mt-1">🐾 {apt.petName} ({apt.petType})</p>}
                  {apt.notes && <p className="text-sm text-gray-400 mt-1 italic">"{apt.notes}"</p>}
                </div>
                 <div className="flex flex-col items-end gap-2">
                   <Badge status={apt.status} />
                   {apt.totalPrice && <p className="font-bold text-gray-900">{formatPrice(apt.totalPrice)}</p>}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

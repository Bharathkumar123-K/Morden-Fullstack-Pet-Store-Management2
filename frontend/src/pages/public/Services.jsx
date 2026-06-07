import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { LoadingPage, Badge } from '../../components/ui'
import { FiClock, FiCalendar } from 'react-icons/fi'
import { MdSpa, MdLocalHospital, MdSchool, MdHouse } from 'react-icons/md'
import { formatPrice } from '../../utils/currency'

const typeIcons = { grooming: MdSpa, veterinary: MdLocalHospital, training: MdSchool, boarding: MdHouse }
const typeColors = { grooming: 'pink', veterinary: 'blue', training: 'orange', boarding: 'teal' }

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services)).finally(() => setLoading(false))
  }, [])

  const types = ['all', 'grooming', 'veterinary', 'training', 'boarding']
  const filtered = activeType === 'all' ? services : services.filter(s => s.type === activeType)

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-500 text-lg">Professional care services for your beloved pets</p>
      </div>

      {/* Type Filter */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setActiveType(t)} className={`px-5 py-2 rounded-full font-medium capitalize text-sm transition-colors ${activeType === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(service => {
          const Icon = typeIcons[service.type] || MdSpa
          const color = typeColors[service.type] || 'gray'
          return (
            <div key={service._id} className="card p-6 hover:shadow-md transition-all">
              <div className={`w-14 h-14 bg-${color}-100 rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`text-2xl text-${color}-600`} />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                <Badge status={service.type} />
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><strong className="text-primary-600">{formatPrice(service.price)}</strong></span>
                <span className="flex items-center gap-1"><FiClock /> {service.duration} min</span>
              </div>
              {service.features?.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/book-appointment" className={`w-full bg-${color}-600 text-white py-2.5 rounded-xl font-medium text-center block hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                <FiCalendar /> Book Now
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

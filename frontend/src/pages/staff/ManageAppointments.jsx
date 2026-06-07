import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, Pagination, EmptyState } from '../../components/ui'
import { FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(statusFilter && { status: statusFilter }) })
      const { data } = await api.get(`/appointments?${params}`)
      setAppointments(data.appointments)
      setPages(data.pages)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAppointments() }, [page, statusFilter])

  const openAppointment = async (id) => {
    try {
      const { data } = await api.get(`/appointments/${id}`)
      setSelected(data.appointment)
      setNewStatus(data.appointment.status)
      setShowModal(true)
    } catch { toast.error('Failed') }
  }

  const updateStatus = async () => {
    try {
      await api.put(`/appointments/${selected._id}`, { status: newStatus })
      toast.success('Updated')
      setShowModal(false)
      fetchAppointments()
    } catch { toast.error('Update failed') }
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>

        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? <LoadingPage /> : appointments.length === 0 ? (
          <EmptyState icon="📅" title="No appointments found" />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Customer', 'Service', 'Pet', 'Date', 'Time', 'Price', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{apt.customer?.name}</td>
                        <td className="px-4 py-3 text-gray-500">{apt.service?.name}</td>
                        <td className="px-4 py-3 text-gray-500">{apt.petName || '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-500">{apt.timeSlot}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{apt.totalPrice ? formatPrice(apt.totalPrice) : '—'}</td>
                        <td className="px-4 py-3"><Badge status={apt.status} /></td>
                        <td className="px-4 py-3">
                          <button onClick={() => openAppointment(apt._id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEye /></button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Appointment Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Customer', selected.customer?.name],
                ['Phone', selected.customer?.phone || '—'],
                ['Service', selected.service?.name],
                ['Type', selected.service?.type],
                ['Date', new Date(selected.date).toLocaleDateString()],
                ['Time', selected.timeSlot],
                ['Pet Name', selected.petName || '—'],
                ['Pet Type', selected.petType || '—'],
                ['Price', selected.totalPrice ? formatPrice(selected.totalPrice) : '—'],
                ['Payment', selected.paymentStatus],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="font-semibold capitalize">{v}</p>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                <strong>Notes:</strong> {selected.notes}
              </div>
            )}
            <div className="flex items-end gap-3 border-t pt-4">
              <div className="flex-1">
                <label className="label">Update Status</label>
                <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={updateStatus} className="btn-primary px-6 py-2.5">Update</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

import { useState, useEffect } from 'react'
import api from '../../services/api'
import StatCard from '../../components/StatCard'

export default function EmployeeDashboard() {
  const [assignments, setAssignments] = useState([])
  const [active, setActive] = useState(null)
  const [form, setForm] = useState({ comment: '', rating: 5 })
  const [error, setError] = useState('')

  useEffect(() => { fetchAssignments() }, [])

  async function fetchAssignments() {
    try {
      const { data } = await api.get('/assignments/my')
      setAssignments(data)
    } catch { setError('Failed to load') }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/assignments/${active.id}/feedback`, form)
      setActive(null)
      setForm({ comment: '', rating: 5 })
      fetchAssignments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit')
    }
  }

  const pending = assignments.filter(a => a.status === 'pending')
  const submitted = assignments.filter(a => a.status === 'submitted')

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Pending Feedback" value={pending.length} color="text-orange-500" />
        <StatCard label="Submitted" value={submitted.length} color="text-green-500" />
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">Pending Feedback</h3>
      <div className="space-y-2">
        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-sm text-gray-400">
            All caught up!
          </div>
        ) : (
          pending.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.review?.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  For <span className="font-medium text-gray-700">{a.review?.employee?.name}</span> · {a.review?.period}
                </p>
              </div>
              <button
                onClick={() => { setActive(a); setError('') }}
                className="ml-3 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Give Feedback
              </button>
            </div>
          ))
        )}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setActive(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{active.review?.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Reviewing <span className="font-medium text-gray-700">{active.review?.employee?.name}</span> · {active.review?.period}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${form.rating >= n ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  rows={4}
                  required
                  placeholder="Write your feedback..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

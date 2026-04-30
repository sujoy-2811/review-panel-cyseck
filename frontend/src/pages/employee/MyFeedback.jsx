import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function MyFeedback() {
  const [assignments, setAssignments] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ comment: '', rating: 5 })
  const [error, setError] = useState('')

  useEffect(() => { fetchAssignments() }, [])

  async function fetchAssignments() {
    try {
      const { data } = await api.get('/assignments/my')
      setAssignments(data.filter(a => a.status === 'submitted'))
    } catch { setError('Failed to load feedback') }
  }

  function openEdit(a) {
    setEditing(a)
    setForm({ comment: a.comment, rating: a.rating })
    setError('')
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/assignments/${editing.id}/feedback`, form)
      setEditing(null)
      fetchAssignments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this feedback? It will go back to pending.')) return
    try {
      await api.delete(`/assignments/${id}/feedback`)
      fetchAssignments()
    } catch { setError('Failed to delete') }
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Submitted Feedback</h2>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-sm text-gray-400">
          No feedback submitted yet
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{a.review?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    For <span className="font-medium text-gray-700">{a.review?.employee?.name}</span> · {a.review?.period}
                  </p>
                  <div className="mt-3 text-yellow-400 text-sm">{'★'.repeat(a.rating)}{'☆'.repeat(5 - a.rating)}</div>
                  <p className="mt-1 text-sm text-gray-700">{a.comment}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Edit Feedback</h3>
            <p className="text-sm text-gray-500 mb-4">
              {editing.review?.title} · <span className="font-medium text-gray-700">{editing.review?.employee?.name}</span>
            </p>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

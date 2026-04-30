import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ employeeId: '', title: '', period: '' })
  const [assignModal, setAssignModal] = useState(null)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [newAssignIds, setNewAssignIds] = useState([])
  const [feedback, setFeedback] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
    fetchEmployees()
  }, [])

  async function fetchReviews() {
    try {
      const { data } = await api.get('/reviews')
      setReviews(data)
    } catch { setError('Failed to load reviews') }
  }

  async function fetchEmployees() {
    try {
      const { data } = await api.get('/employees')
      setEmployees(data)
    } catch { setError('Failed to load employees') }
  }

  async function handleCreateReview(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/reviews', form)
      setForm({ employeeId: '', title: '', period: '' })
      await fetchReviews()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create review')
    }
  }

  function openAssign(review) {
    setAssignModal(review)
    setNewAssignIds([])
  }

  async function handleAssign() {
    if (!newAssignIds.length) return
    try {
      await api.post(`/reviews/${assignModal.id}/assign`, { participantIds: newAssignIds })
      setAssignModal(null)
      await fetchReviews()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign reviewers')
    }
  }

  async function openFeedback(reviewId) {
    try {
      const { data } = await api.get(`/reviews/${reviewId}/feedback`)
      setFeedback(data)
      setFeedbackModal(reviewId)
    } catch { setError('Failed to load feedback') }
  }

  function toggleNew(id) {
    setNewAssignIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // only employees (not admins), excluding the reviewee
  function eligibleReviewers(review) {
    const assignedIds = review.assignments?.map(a => a.participantId) || []
    return employees.filter(e => e.role === 'employee' && e.id !== review.employeeId)
      .map(e => ({ ...e, alreadyAssigned: assignedIds.includes(e.id) }))
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Create Review</h3>
        <form onSubmit={handleCreateReview} className="flex flex-wrap gap-3 items-end">
          <select
            value={form.employeeId}
            onChange={e => setForm({ ...form, employeeId: e.target.value })}
            required
            className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select employee...</option>
            {employees.filter(e => e.role === 'employee').map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Period (e.g. Q1 2026)"
            value={form.period}
            onChange={e => setForm({ ...form, period: e.target.value })}
            required
            className="flex-1 min-w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map(review => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{review.title}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{review.employee?.name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{review.period}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-24 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: review.totalFeedback > 0 ? `${(review.feedbackGiven / review.totalFeedback) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{review.feedbackGiven}/{review.totalFeedback}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openAssign(review)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => openFeedback(review.id)}
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Feedback
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No reviews yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign reviewers modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setAssignModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Assign Reviewers</h3>
            <p className="text-sm text-gray-500 mb-4">{assignModal.title}</p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {eligibleReviewers(assignModal).map(emp => (
                <label
                  key={emp.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                    emp.alreadyAssigned
                      ? 'border-green-200 bg-green-50 cursor-not-allowed'
                      : newAssignIds.includes(emp.id)
                        ? 'border-blue-300 bg-blue-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={emp.alreadyAssigned || newAssignIds.includes(emp.id)}
                    disabled={emp.alreadyAssigned}
                    onChange={() => !emp.alreadyAssigned && toggleNew(emp.id)}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                    {emp.department && <p className="text-xs text-gray-500">{emp.department}</p>}
                  </div>
                  {emp.alreadyAssigned && (
                    <span className="text-xs text-green-600 font-medium">Assigned</span>
                  )}
                </label>
              ))}
              {eligibleReviewers(assignModal).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No eligible reviewers</p>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => setAssignModal(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!newAssignIds.length}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                Assign {newAssignIds.length > 0 ? `(${newAssignIds.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback results modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setFeedbackModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Feedback Results</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {feedback.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No feedback submitted yet</p>
              ) : (
                feedback.map((f, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{f.participant?.name}</span>
                      <div className="text-yellow-400 text-sm">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                    </div>
                    {f.participant?.department && (
                      <p className="text-xs text-gray-500 mb-2">{f.participant.department}</p>
                    )}
                    <p className="text-sm text-gray-700">{f.comment}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setFeedbackModal(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

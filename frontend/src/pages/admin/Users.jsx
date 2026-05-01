import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Users() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', role: 'employee' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchEmployees() }, [])

  async function fetchEmployees() {
    try {
      const { data } = await api.get('/employees')
      setEmployees(data)
    } catch {
      setError('Failed to load employees')
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { role } = form
      await api.post('/employees', form)
      setForm({ name: '', email: '', password: '', department: '', role: 'employee' })
      fetchEmployees()
      const label = role === 'admin' ? 'Admin' : 'Employee'
      setSuccess(`${label} created! A welcome email with a password reset link has been sent.`)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this employee?')) return
    try {
      await api.delete(`/employees/${id}`)
      fetchEmployees()
    } catch {
      setError('Failed to delete employee')
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Employees</h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Employee</h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-wrap sm:flex-row gap-3 items-stretch sm:items-end">
          {[
            { placeholder: 'Name', key: 'name', type: 'text' },
            { placeholder: 'Email', key: 'email', type: 'email' },
            { placeholder: 'Password', key: 'password', type: 'password' },
            { placeholder: 'Department', key: 'department', type: 'text' },
          ].map(f => (
            <input
              key={f.key}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              required={f.key !== 'department'}
              className="w-full sm:flex-1 sm:min-w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">{emp.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{emp.department || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No employees yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

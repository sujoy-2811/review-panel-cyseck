import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [status, setStatus] = useState('loading') // loading | ready | success | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); setError('No reset token found in link.'); return }

    api.get(`/auth/reset-password?token=${token}`)
      .then(({ data }) => { setEmail(data.email); setStatus('ready') })
      .catch(err => { setStatus('error'); setError(err.response?.data?.message || 'Invalid or expired link') })
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }

    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      setStatus('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Validating link...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Password set!</h2>
          <p className="text-sm text-gray-500 mb-6">You can now log in with your new password.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Link invalid</h2>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Set your password</h2>
        <p className="text-sm text-gray-500 mb-6">{email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              required
              placeholder="Repeat password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  )
}

import axios from 'axios'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = getCookie('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// if token expired or user lost admin access, send them back to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api

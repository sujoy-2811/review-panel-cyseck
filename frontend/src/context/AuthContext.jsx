import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = getCookie('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  function login(userData, token) {
    setCookie('token', token)
    setCookie('user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    deleteCookie('token')
    deleteCookie('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold">Review Panel</h2>
        <button onClick={() => setOpen(o => !o)} className="p-1 rounded text-slate-300 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Sidebar backdrop on mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-40 h-screen w-56 bg-slate-900 text-white flex flex-col flex-shrink-0
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="px-4 py-5 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Review Panel</h2>
          <span className="mt-1 inline-block text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">Admin</span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <NavLink
            to="/admin/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            Employees
          </NavLink>
          <NavLink
            to="/admin/reviews"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            Reviews
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded-lg transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50 pt-12 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}

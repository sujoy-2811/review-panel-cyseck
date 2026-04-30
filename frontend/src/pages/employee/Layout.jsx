import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function EmployeeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 bg-slate-900 text-white flex flex-col flex-shrink-0 h-screen overflow-y-hidden">
        <div className="px-4 py-5 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Review Panel</h2>
          <span className="mt-1 inline-block text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">Employee</span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/my-feedback"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            My Feedback
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

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

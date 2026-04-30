import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AdminLayout from './pages/admin/Layout'
import Users from './pages/admin/Users'
import Reviews from './pages/admin/Reviews'
import EmployeeLayout from './pages/employee/Layout'
import EmployeeDashboard from './pages/employee/Dashboard'
import MyFeedback from './pages/employee/MyFeedback'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<Users />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>

          <Route path="/dashboard" element={
            <ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>
          }>
            <Route index element={<EmployeeDashboard />} />
            <Route path="my-feedback" element={<MyFeedback />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import TripHistory from "./pages/TripHistory"
import AIAssistant from "./pages/AIAssistant"
import Expenses from "./pages/Expenses"

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/trips" element={user ? <TripHistory /> : <Navigate to="/login" />} />
      <Route path="/ai" element={user ? <AIAssistant /> : <Navigate to="/login" />} />
      <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
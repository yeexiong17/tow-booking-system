import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { supabase } from './supabase'
import { useAuth } from './Context'

import ProtectedRoute from './components/ProtectedRoute'
import Public from './page/Public'
import Home from './page/Home'
import BookingDetails from './page/User/BookingDetails'
import SignUp from './page/User/SignUp'
import Login from './page/Login'

function App() {
  const [loading, setLoading] = useState(true)
  const { auth, setAuth, setUserData } = useAuth()

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log(session.user)
        setAuth(session.user)
        setUserData(session.user)
      } else {
        setAuth(null)
        setUserData(null)
      }
      setLoading(false)
    })
  }, [])

  return (
    <>
      {
        loading ? (
          <div> Loading...</div >
        ) : (
          <Routes>
            {!auth ? (
              <>
                <Route path="/*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Public />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
              </>
            ) : auth?.user_metadata?.role === 'superadmin' ? (
              <>
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      {/* <Navigate to="/manage-admin" replace /> */}
                    </ProtectedRoute>
                  }
                />
              </>
            ) : auth?.user_metadata?.role === 'admin' ? (
              <>
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      {/* <Navigate to="/admin-dashboard" replace /> */}
                    </ProtectedRoute>
                  }
                />
              </>
            ) : auth?.user_metadata?.role === 'tow' ? (
              <>
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      {/* <Navigate to="/admin-dashboard" replace /> */}
                    </ProtectedRoute>
                  }
                />
              </>
            ) : (
              <>
                {/* Protected Routes */}
                <Route
                  path="/*"
                  element={
                    <Navigate to="/home" replace />
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-details"
                  element={
                    <ProtectedRoute>
                      <BookingDetails />
                    </ProtectedRoute>
                  }
                />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )
      }
    </>
  )
}

export default App
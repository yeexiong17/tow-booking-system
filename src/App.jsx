import { useEffect } from 'react'
import { Navigate, replace, Route, Routes } from 'react-router-dom'

import { supabase } from './supabase'
import { useAuth } from './Context'

import ProtectedRoute from './components/ProtectedRoute'
import Public from './page/Public'
import Home from './page/Home'
import BookingDetails from './page/User/BookingDetails'
import SignUp from './page/User/SignUp'
import Login from './page/Login'

function App() {
  const { auth, setAuth, setUserData } = useAuth()

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log("Authenticated")
        setAuth(session?.user)
        setUserData(session?.user)
      } else {
        console.log("Unauthenticated")
        setAuth(null)
        setUserData(null)
      }
    })
  }, [])

  return (
    <Routes>
      {!auth ? (
        <>
          <Route path="/*" element={<Navigate to="/" />} />
          <Route path="/" element={<Public />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </>
      ) : (
        <>
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <Navigate to="/home" />
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

    </Routes>
  )
}

export default App

import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { supabase } from './supabase'
import { useAuth } from './Context'

import ProtectedRoute from './components/ProtectedRoute'
import Public from './page/Public'
import Home from './page/Home'
import SignUp from './page/SignUp'
import Login from './page/Login'
import Dashboard from './page/Admin/Dashboard'
import Profile from './page/Profile'
import Feedback from './page/Feedback'
import ManageAdmin from './page/Superadmin/ManageAdmin'
import AdminSetting from './page/AdminSetting'
import TowDriverApplication from './page/Admin/TowDriverApplication'
import History from './page/User/History'
import TowBooking from './page/Tow/TowBooking'
import ManageUserAndTow from './page/Admin/ManageUserAndTow'
import Report from './page/Admin/Report'
import NotVerified from './page/Tow/NotVerified'
import WaitVerify from './page/Tow/WaitVerify'
import RequestTow from './page/User/RequestTow'

function App() {
  const [loading, setLoading] = useState(true)
  const { auth, setAuth, setUserData } = useAuth()
  const [towDriverDetails, setTowDriverDetails] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log(session.user)
        setAuth(session.user)
        setUserData(session.user)

        if (session.user.user_metadata.role === 'tow') {
          getTowDriverDetails(session.user.id)
        }
      } else {
        setAuth(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const getTowDriverDetails = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tow_driver_details')
        .select('*')
        .eq('user_id', userId)

      console.log(data)
      setTowDriverDetails(data[0])
    } catch (error) {
      console.log(error)
    }
  }

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
                      <Navigate to="/manage-admin" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-admin"
                  element={
                    <ProtectedRoute>
                      <ManageAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-setting"
                  element={
                    <ProtectedRoute>
                      <AdminSetting />
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
                      <Navigate to="/admin-dashboard" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-user-tow"
                  element={
                    <ProtectedRoute>
                      <ManageUserAndTow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tow-driver-application"
                  element={
                    <ProtectedRoute>
                      <TowDriverApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-report"
                  element={
                    <ProtectedRoute>
                      <Report />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-setting"
                  element={
                    <ProtectedRoute>
                      <AdminSetting />
                    </ProtectedRoute>
                  }
                />
              </>
            ) : auth?.user_metadata?.role === 'tow' ? (
              auth?.user_metadata?.status === 'active' ? (
                <>
                  <Route
                    path="/*"
                    element={
                      <Navigate to="/tow-booking" replace />
                    }
                  />
                  <Route
                    path="/tow-booking"
                    element={
                      <ProtectedRoute>
                        <TowBooking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </>
              ) : towDriverDetails?.status == 'pending' ? (
                <>
                  <Route
                    path="/*"
                    element={
                      <Navigate to="/wait-verify" replace />
                    }
                  />
                  <Route
                    path="/wait-verify"
                    element={
                      <ProtectedRoute>
                        <WaitVerify />
                      </ProtectedRoute>
                    }
                  />
                </>
              ) : (
                <>
                  <Route
                    path="/*"
                    element={
                      <Navigate to="/not-verified" replace />
                    }
                  />
                  <Route
                    path="/not-verified"
                    element={
                      <ProtectedRoute>
                        <NotVerified />
                      </ProtectedRoute>
                    }
                  />
                </>
              )
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
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/request-tow"
                  element={
                    <ProtectedRoute>
                      <RequestTow />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes >
        )
      }
    </>
  )
}

export default App
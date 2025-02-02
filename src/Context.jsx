import { createContext, useState, useContext, useEffect } from "react"
import { supabase } from "./supabase"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)
    const [userData, setUserData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)

    const isMobile = width <= 768

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const toggle = () => {
        setVisible((prev) => !prev)
    }

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth)
    }

    return (
        <AuthContext.Provider value={{ signOut, auth, setAuth, userData, setUserData, visible, toggle, isMobile }}>
            {children}
        </AuthContext.Provider>
    )
}

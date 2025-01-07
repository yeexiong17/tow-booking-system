import React, { createContext, useState, useContext } from "react"
import { supabase } from "./supabase";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)
    const [userData, setUserData] = useState(null)
    const [visible, setVisible] = useState(false)

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const toggle = () => {
        setVisible((prev) => !prev)
    }

    return (
        <AuthContext.Provider value={{ signOut, auth, setAuth, userData, setUserData, visible, toggle, }}>
            {children}
        </AuthContext.Provider>
    );
};

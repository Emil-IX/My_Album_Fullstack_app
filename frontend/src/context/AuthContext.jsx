import React, { createContext, useContext, useState, useEffect, use } from "react";
import { jwtDecode } from "jwt-decode";
import api, { setAuthToken } from "../api/axios";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [ token, setToken ] = useState( localStorage.getItem("token") || null );
    const [ user, setUser ] = useState( () =>{
        try {
            return token ? jwtDecode(token) : null

        } catch  {
            return null

        }
    } );


    useEffect(() => {

    if (token) {
        setAuthToken(token)
        setUser(jwtDecode(token))
        localStorage.setItem("token", token)
        
    } else {
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem("token")
    }

  
}, [token])

    const login = async ({email, password}) => {

        const res = await api.post("/auth/login", { email, password })
        const newToken = res.data.token || res.data.accessToken
        if (!newToken)  throw new Error("No token received")
        setToken(newToken)

    }

    const logout = () => {
        setToken(null)
    }

    return(
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}


export const useAuth = () =>  useContext(AuthContext)



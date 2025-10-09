import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";

const Login = () => {

    const { login } = useAuth()
    const navigate = useNavigate()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (!email || !password)  throw new Error("Email and password are required")
            await login({email, password})
            navigate("/dashboard")
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            setTimeout(() => { setError(null)}, 3000);
        } finally {
            setLoading(false)
        }
    }

    return (
       
            <form 
                onSubmit={handleSubmit}
                className=" flex flex-col items-center gap-2 border border-white/95 bg-white p-6 rounded-lg shadow-md w-100"
            >
                 <h2 className="text-xl  text-blue-500  text-center font-bold mb-4">Sign In</h2>
                {error && <p className="text-red-500 mb-2 bg-red-100 p-1 border rounded w-full">{error}</p>}

                <input 
                    type="email" 
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value) }
                    className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                
                <input 
                    type="password" 
                    placeholder='Password'
                    value={password}
                    onChange={(e)=> setPassword(e.target.value) }
                   className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 shadow-sm"
                >
                    {loading ? "Loading..." :"Login"}
                </button>
                <div className='flex gap-3'>
                    <Link to="/register" className="text-blue-500 underline">
                        Sign up Here
                    </Link>
                    <Link to="/forgot-password" className="text-blue-500 underline text-right">
                    Forgot your password?
                    </Link>
                </div>
              

            </form>

     
    )
    

}

export default Login
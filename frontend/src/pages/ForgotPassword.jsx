import React from 'react'
import { useState } from 'react'
import api from "../api/axios";

export default function ForgotPassword() {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const handleSubmit = async (e) =>{
          e.preventDefault()
          setLoading(true)
          setError(null)
          setMessage(null)

          try {

            if (!email)  throw new Error("Emai is required")
            const res = await api.post('/auth/forgot-password', {email})
            setMessage(res.data.message || "Check your email for reset instructions.")
            
          } catch (err) {
             setError(err.response?.data?.message || err.message)
             setTimeout(() => { setError(null)  }, 2000);
          } finally {
            setLoading(false)
          }

    }


  return (
      
            <form 
                onSubmit={handleSubmit}
                className=" flex flex-col gap-2 border border-white bg-white/95 p-6 rounded-lg shadow-md w-100"
            >
                 <h2 className="text-xl  text-blue-500  text-center font-bold mb-4">Forgot Password</h2>
                {error && <p className="text-red-500 mb-2 bg-red-100 p-1 border rounded">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}

                <input 
                    type="email" 
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value) }
                   className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                
                <button
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 shadow-sm"
                >
                    {loading ? "Sending..." :"Send reset link"}
                </button>
              

            </form>

  )
}

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
      <div className="background1 flex  items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit}
                className=" flex flex-col gap-2 border border-white bg-black p-6 rounded-lg shadow-md w-100"
            >
                 <h2 className="text-xl  text-white  text-center font-bold mb-4">Forgot Password</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}

                <input 
                    type="email" 
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value) }
                    className="w-full mb-3 px-3 py-2 border rounded  bg-white"
                />
                
                <button
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Sending..." :"Send reset link"}
                </button>
              

            </form>

        </div>
  )
}

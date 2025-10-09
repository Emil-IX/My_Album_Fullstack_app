import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'







export const Register = () => {

    const { login } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


   const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {

        if(!name || !email || !password || !age) throw new Error('There is an emty field')
        await api.post("/auth/register", { name, email, password, age })
        await login({ email, password})
        navigate("/dashboard")

      } catch (err) {
            setError(err.response?.data?.message || err.message)
            setTimeout(() => { setError(null)}, 3000)
    } finally {
        setLoading(false)
    }


   }





  return (
   
        <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-white  gap-3 bg-white/95 p-6 rounded-lg shadow-md w-100"
        >
            <h2 className=" text-center text-xl  text-blue-500 font-bold mb-4 ">Register</h2>
           {error && <p className="text-red-500 mb-2 bg-red-100 p-1 border rounded">{error}</p>}

            <input 
                type="text" 
                placeholder='Insert name'
                value={name}
                onChange={e => setName(e.target.value)}
               className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />

              <input 
                type="email" 
                placeholder='Insert email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />

                
              <input 
                type="password" 
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />

              <input 
                type="date" 
                placeholder='birthdate'
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full p-2 mb-3 mb-3 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />

                <button
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 shadow-sm"
                >
                    {!loading ?'Sign up' :'Loading...' }
                </button>
                 <Link to="/login" className=" text-blue-500 underline">
                    Sign in
                </Link>

        </form>

   
  )
}

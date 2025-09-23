import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useState } from 'react'

export default function ResetPassword() {

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [configPassword, setConfigPassword] = useState('')
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { token } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)


        try {
            if (!password || !configPassword) throw new Error("A field is enty");
            if (password !== configPassword) throw new Error("Password are not the same, try again");
            const res = await api.post(`/auth/reset-password/${token}`, { password })
            setMessage(res.data.message || "Password reset successfully!")
            setTimeout(() => { navigate("/login") }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="background1 flex  items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="relative  flex flex-col gap-2 border border-white bg-black p-6 rounded-lg shadow-md w-100"
            >
                <h2 className="text-xl  text-white  text-center font-bold mb-4">Reset Password</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}

                <div className="relative w-full mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pr-10 px-3 py-2 border rounded bg-white"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>


                <input
                    type="password"
                    placeholder='Confirm Password'
                    value={configPassword}
                    onChange={(e) => setConfigPassword(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded  bg-white"
                />

                <button
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                

            </form>

        </div>
    )
}

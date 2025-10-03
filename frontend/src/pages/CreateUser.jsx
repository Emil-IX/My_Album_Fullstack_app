import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useState } from "react"


export default function CreateUser() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const Navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (!name || !email || !role || !age || !password || !passwordConfirm) {
                setError("All fields are required")
                return
            }

            if (password !== passwordConfirm) {
                setError("Passwords do not match")
                return
            }
            const res = await api.post('/users', { name, email, role, age, password })
            Navigate("/settings/users")
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10   ">
                <h2 className="text-xl font-bold text-blue-500 ">Create User</h2>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="role"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <input
                        type="date"
                        name="date"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="Confirm password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    {error && <p className="py-1 px-2 text-red-500 bg-red-100 rounded">{error}</p>}
                    <button
                        type="submit"
                        className="text-white px-4 py-2 bg-blue-400 rounded hover:bg-blue-500"
                        disabled={loading}
                    >
                        Create User
                    </button>

                </form>
            </div>

        </div>
    )
}

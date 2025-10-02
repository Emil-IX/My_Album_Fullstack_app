import { useState, useEffect, use } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Edit, Trash2 } from "lucide-react"

export default function UsersManager() {
  const { token, loadingAuth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [appearModal, setAppearModal] = useState(false)
  const [selectUser, setSelectUser] = useState(null)
  const [formInformation, setFormInformation] = useState({
    name: '',
    role: '',
    age: '',
    email: '',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      if (loadingAuth) return; // espera a que AuthContext inicialice
      setLoading(true);

      if (!token) {
        setError("No token available");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, loadingAuth]);


  const deleteUser = async (userId) => {
    try {
      let sure = confirm("Are you sure you want errase this user?")
      if (sure) {
        const res = await api.delete(`/users/${userId}`)
        setData((prev) => prev.filter((u) => u._id !== userId))
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }


  const openEditModal = (user) => {
    setSelectUser(user)
    setFormInformation({
      name: user.name,
      role: user.role,
      age: user.age,
      email: user.email,
    })
    setAppearModal(true)
  }

  const onChangeInputs = (e) => {
    setFormInformation({
      ...formInformation,
      [e.target.name]: e.target.value,
    })
  }

  const updateUser = async (e) => {
    e.preventDefault()

    try {
      const res = await api.put(`/users/${selectUser._id}`, formInformation)
      setData((prev) =>
        prev.map(user => user._id == selectUser._id ? res.data : user)
      )
      setAppearModal(false)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }

  }

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="mb-5">Users Manager</h2>

      <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md">
        <thead className="bg-blue-900">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Birth Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map(({ _id, name, role, age, email }) => (
            <tr key={_id} className="hover:bg-blue-100 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">
                {name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {role}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {age.split('T')[0]}</td>
              <td className="px-6 py-4 text-center flex justify-center gap-3">
                <button
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                  onClick={() => openEditModal({ _id, name, role, age, email })}
                >
                  <Edit className="w-5 h-5" />
                </button>

                <button
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  onClick={() => deleteUser(_id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </td>
            </tr>

          ))}
        </tbody>

      </table>
      {/*  Modal */}
      {appearModal && (
        <div className="">
          <div className="">
            <h3>Edit User</h3>
            <form onSubmit={updateUser}>
              <input
                type="text"
                name="name"
                value={formInformation.name}
                onChange={onChangeInputs}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="role"
                value={formInformation.role}
                onChange={onChangeInputs}
                placeholder="Role"
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="age"
                value={formInformation.age}
                onChange={onChangeInputs}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formInformation.email}
                onChange={onChangeInputs}
                placeholder="Email"
                className="w-full p-2 border rounded"
                disabled={true}
              />

              <div>
                <button
                  type="button"
                  onClick={() => setAppearModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className=""
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>

      )}



    </div>
  );
}

import { useState, useEffect, } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import UsersTable from "../components/UsersTable";
import UserModal from "../components/UserModal"
import { useNavigate } from "react-router-dom";

export default function UsersManager() {
  const { token, loadingAuth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [appearModal, setAppearModal] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [formInformation, setFormInformation] = useState({
    name: "",
    role: "",
    age: "",
    email: "",
  });

  const Navigate = useNavigate()

  //  inicial fetch
  useEffect(() => {
    const fetchUsers = async () => {
      if (loadingAuth) return;
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

  // Delete users
  const deleteUser = async (userId) => {
    try {

      await api.delete(`/users/${userId}`);
      setData((prev) => prev.filter((u) => u._id !== userId));

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // openmodal with users
  const openEditModal = (user) => {
    setSelectUser(user);
    setFormInformation({
      name: user.name,
      role: user.role,
      age: user.age,
      email: user.email,
    });
    setAppearModal(true);
  };

  // chaanges management in form
  const onChangeInputs = (e) => {
    setFormInformation({
      ...formInformation,
      [e.target.name]: e.target.value,
    });
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      if (!formInformation.name || !formInformation.role || !formInformation.age) {
        setError("Please fill all the fields");
        return;
      }
      const res = await api.put(`/users/${selectUser._id}`, formInformation);
      setData((prev) =>
        prev.map((user) => (user._id === selectUser._id ? res.data : user))
      );
      setAppearModal(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // clear user after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return <p>Loading users...</p>;
  if (user?.role !== "admin") return <p className="p-3 bg-white mt-15 rounded text-red-500 font-semibold text-center flex item-center w-full">Access denied, you are not authorized to view this content</p>;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900  ">Users Manager</h2>
        <button
          className="px-5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer shadow-sm"
          type="button"
          onClick={() => Navigate("/settings/users/createUser")}
        >
          Create user</button>
      </div>
      <UsersTable data={data} deleteUser={deleteUser} openEditModal={openEditModal} />
      {appearModal && (
        <UserModal
          formInformation={formInformation}
          onChangeInputs={onChangeInputs}
          updateUser={updateUser}
          closeModal={() => setAppearModal(false)}
          error={error}
        />
      )}
    </div>
  );
}

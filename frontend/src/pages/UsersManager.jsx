import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import UsersTable from "../components/UsersTable";
import UserModal from "../components/UserModal"

export default function UsersManager() {
  const { token, loadingAuth } = useAuth();
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
      if (confirm("Are you sure you want to erase this user?")) {
        await api.delete(`/users/${userId}`);
        setData((prev) => prev.filter((u) => u._id !== userId));
      }
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

  return (
    <div>
      <h2 className="mb-5">Users Manager</h2>
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

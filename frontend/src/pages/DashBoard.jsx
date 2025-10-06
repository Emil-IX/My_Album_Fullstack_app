import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className=" p-6 bg-white  rounded shadow-md">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome {user?.name}</p>
      <p>ID: {user?.id} </p>
      <p>Role: {user?.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

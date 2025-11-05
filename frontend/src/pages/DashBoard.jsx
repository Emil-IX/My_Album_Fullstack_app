
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="mt-7 p-6 bg-white  rounded shadow-md">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome {user?.name}</p>
      <p>Role: {user?.role}</p>
  
    </div>
  );
};

export default Dashboard;

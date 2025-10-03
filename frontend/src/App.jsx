import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersManager   from "./pages/UsersManager";
import ProtectedRoute from "./router/ProtectedRoute";
import { Register } from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateLayout from "./layouts/PrivateLayout";
import CreateUser from "./pages/CreateUser";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/" element={ <PrivateLayout/> } >
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route path="/settings/users" element={
              <ProtectedRoute>
                < UsersManager/>
              </ProtectedRoute>
            } />
          <Route path="/settings/users/createUser" element={
              <ProtectedRoute>
                < CreateUser/>
              </ProtectedRoute>
            } />

          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

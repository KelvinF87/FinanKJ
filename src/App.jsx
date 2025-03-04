import "./App.css";
import { AuthContext } from "./contexts/AuthContext"; // Adjust the path as necessary
import NavBar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./components/Login";
import { Ingresos } from "./pages/Ingresos";
import { Gastos } from "./pages/Gastos";
import { Ajustes } from "./pages/Ajustes";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import axios from "axios";


function App() {
const API_URL = import.meta.env.VITE_API_URI;
const token = localStorage.getItem("authToken")
useEffect(() => {
  // axios
  //   .get(`${API_URL}/api/students?$`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     setStudents(response.data)})
  //   .catch((error) => console.log(error));
}, []);
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/ingreso" element={token ? <Ingresos /> : <Navigate to="/login" />} />
        <Route path="/gastos" element={token ? <Gastos /> : <Navigate to="/login" />} />
        <Route path="/config" element={token ? <Ajustes /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />


        {/* Not Found Route */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;

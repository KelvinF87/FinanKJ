import "./App.css";
import { AuthContext } from "./contexts/AuthContext"; // Adjust the path as necessary
import NavBar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
// import { Login } from "./components/Loginkkk";
import { Ingresos } from "./pages/Ingresos";
import { Gastos } from "./pages/Gastos";
import { Ajustes } from "./pages/Ajustes";
import Profile from "./pages/Profile";
import { useContext, useEffect } from "react";
import axios from "axios";
// import { Signup } from "./components/Signup";
import { AuthForm } from "./components/Login";

function App() {
  const API_URL = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("authToken");
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  return (
    <>
      {location.pathname !== "/login"  && <NavBar />}
      {/* {location.pathname !=="/signup" && <NavBar />} */}
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/ingreso" element={<Ingresos />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/config" element={<Ajustes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;

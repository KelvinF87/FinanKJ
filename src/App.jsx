import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import NavBar from "./components/Navbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Ingresos } from "./pages/Ingresos";
import { Gastos } from "./pages/Gastos";
import { Ajustes } from "./pages/Ajustes";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { AuthForm } from "./components/Login";
import CheckUserStatus from "./components/CheckUserStatus";

function App() {
  const API_URL = import.meta.env.VITE_API_URI;
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/"
          element={
            user ? (
              <CheckUserStatus userId={user._id}>
                <Dashboard />
              </CheckUserStatus>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ingreso"
          element={
            user ? (
              <CheckUserStatus userId={user._id}>
                <Ingresos />
              </CheckUserStatus>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/gastos"
          element={
            user ? (
              <CheckUserStatus userId={user._id}>
                <Gastos />
              </CheckUserStatus>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/config"
          element={
            user ? (
              <CheckUserStatus userId={user._id}>
                <Ajustes />
              </CheckUserStatus>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <CheckUserStatus userId={user._id}>
                <Profile />
              </CheckUserStatus>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<h1>Not Found 404</h1>} />
      </Routes>
    </>
  );
}

export default App;

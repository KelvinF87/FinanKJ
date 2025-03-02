import "./App.css";
import { useAuth } from "./contexts/AuthContext"; // Adjust the path as necessary
import NavBar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./components/Login";
import { Ingresos } from "./pages/Ingresos";
import { Gastos } from "./pages/Gastos";
import { Ajustes } from "./pages/Ajustes";
import Profile from "./pages/Profile";

function App() {
  const { token } = useAuth();

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

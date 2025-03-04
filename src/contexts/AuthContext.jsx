import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const usersData = [
  {
    name: "Kelvin",
    id: "1",
    username: "kelvin",
    password: "123", // En un entorno real, usa hashes de contraseñas
    email: "correo@mi.com",
    roles: ["user", "admin"],
  },
  {
    name: "Daniel",
    id: "2",
    username: "daniel",
    password: "123",
    email: "correo@mi.com",
    roles: ["user"],
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (username, password) => {
    const userData = usersData.find(user => user.username === username);
    if (userData && userData.password === password) {
      setUser(userData);
      setToken("123"); // En un entorno real, genera un token dinámico

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "123");

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

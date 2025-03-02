import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const usersData = {
  "kelvin": {
    "id": "1",
    "username": "kelvin",
    "password": "123",
    "email": "kelvin@example.com",
    "roles": ["user"]
  },
  "admin": {
    "id": "2",
    "username": "admin",
    "password": "123",
    "email": "admin@example.com",
    "roles": ["admin", "user"]
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (username, password) => {
    const userData = usersData[username];
    if (userData && userData.password === password) {
      setUser(userData);
      setToken('123');

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', '123');

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // Remove user and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
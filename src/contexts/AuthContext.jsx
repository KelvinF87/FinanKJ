import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

export const AuthContext = createContext();

export const AuthProviderWrapper = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const user = response.data;

      if (!user.active) {
        setAuthError("This account has been deactivated.");
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        localStorage.removeItem("authToken");
        return;
      }

      setIsLoggedIn(true);
      setIsLoading(false);
      setUser(user);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.response?.data?.message || "La autenticación falló");
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      localStorage.removeItem("authToken");
    }
  };

  const checkUserActiveStatus = useCallback(async (userId) => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
        return false;
    }

    try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        return response.data.active;
    } catch (error) {
        console.error("Error checking user active status:", error);
        return false;
    }
}, []);

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        setUser,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
        checkUserActiveStatus,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

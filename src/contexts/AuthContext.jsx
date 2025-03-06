import React, { createContext, useState, useEffect } from "react";
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

            // **Important: Check if the user is active**
            if (!user.active) {
                setAuthError("This account has been deactivated.");
                setIsLoggedIn(false);
                setIsLoading(false);
                setUser(null);
                localStorage.removeItem("authToken"); // Remove invalid token
                return;
            }

            setIsLoggedIn(true);
            setIsLoading(false);
            setUser(user);
            setAuthError(null); // Clear any previous errors

        } catch (error) {
            setAuthError(error.response?.data?.message || "La autenticación falló");
            setIsLoggedIn(false);
            setIsLoading(false);
            setUser(null);
            localStorage.removeItem("authToken"); // Remove invalid token
        }
    };

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
                setUser, // Pass the setUser function
                storeToken,
                authenticateUser,
                logOutUser,
                authError,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
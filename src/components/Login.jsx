import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const Login = () => {
  const API_URL = import.meta.env.VITE_API_URI;
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { storeToken, authenticateUser, isLoggedIn,logOutUser } = useContext(AuthContext);
  
  const handleUserName = (e) => setUserName(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
      if (isLoggedIn) {
        navigate("/");
      }
    };

    verifyAuth();
  }, [isLoggedIn, navigate]);
  // if(localStorage.getItem("authToken")){console.log("logged in")}

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = { username, password };
    console.log(`${API_URL}/auth/login`, requestBody);
    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        // console.log("JWT token", response.data.authToken);
        // console.log(isLoggedIn);
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUserName}
        className="input input-bordered mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePassword}
        className="input input-bordered mb-4"
      />
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ModalMensaje from "./ModalMensaje";

export const AuthForm = () => {
  const API_URL = import.meta.env.VITE_API_URI;
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [outPhoto, setOutPhoto] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal

  const navigate = useNavigate();
  const { storeToken, authenticateUser, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    clearForm();
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setLastname("");
    setEmail("");
    setImage("");
    setPasswordC("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const requestBody = { username, password };

    if (isLogin) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, requestBody);
        storeToken(response.data.authToken);
        authenticateUser();

        if (!isLoggedIn) {
          setModalMessage("Usuario no puede ser logueado o está desactivado. Contactar con el administrador.");
          setIsModalOpen(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Error al iniciar sesión");
        }
      }
    } else {
      if (password !== passwordC) {
        setErrorMessage("Las contraseñas no coinciden");
        return;
      }

      const signupData = {
        username,
        email,
        password,
        name,
        lastname,
        roles: "user",
        active: true,
        image,
      };

      try {
        const response = await axios.post(`${API_URL}/auth/signup`, signupData);
        setSuccessMessage("Usuario creado exitosamente. Por favor, inicia sesión.");
        navigate("login");
        clearForm();
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Error al registrar usuario");
        }
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center h-screen"
      >
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered mb-4"
              required={!isLogin}
            />
            <input
              type="text"
              placeholder="Apellidos"
              name="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="input input-bordered mb-4"
              required={!isLogin}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered mb-4"
              required={!isLogin}
            />
            <input
              type="text"
              placeholder="URL de foto"
              name="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input input-bordered mb-4"
              onBlur={() => setOutPhoto(true)}
            />
            {outPhoto && <img src={image} alt="foto de Usuario" />}
          </>
        )}

        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered mb-4"
          required
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirmar Password"
            name="passwordC"
            value={passwordC}
            onChange={(e) => setPasswordC(e.target.value)}
            className="input input-bordered mb-4"
            required={!isLogin}
          />
        )}

        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Signup"}
        </button>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button type="button" className="btn btn-link my-2" onClick={toggleFormMode}>
          {isLogin ? "Crea tu usuario" : "Ya tengo cuenta"}
        </button>
      </form>

      <ModalMensaje
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        mensaje={modalMessage}
        title="Información"
        confirmLabel="Entendido"
        confirmStyle="btn-primary"
      />
    </>
  );
};

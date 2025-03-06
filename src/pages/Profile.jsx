import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import ModalMensaje from "../components/ModalMensaje"; // Import ModalMensaje

const Profile = () => {
  const { isLoggedIn, logOutUser, isLoading, authenticateUser, user, setUser } =
    useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URI;
  const [photoURL, setPhotoURL] = useState("");
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmLabel: 'Confirmar',
        confirmStyle: 'btn-error',
        onClose: () => setIsModalOpen(false)
    });

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthAndFetchUser = async () => {
      await authenticateUser();

      if (!isLoggedIn && !isLoading) {
        navigate("/login");
        return;
      }

      if (user) {
        setPhotoURL(user.image);
        setNewUsername(user.username || "");
      }
    };

    verifyAuthAndFetchUser();
  }, [isLoggedIn, isLoading, navigate]);

    const confirmUpdateUser = async (updateData) => {
        try {
            const token = localStorage.getItem("authToken");
            const userId = user._id;

            const response = await axios.put(
                `${API_URL}/api/users/${userId}`,
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUser({ ...user, ...response.data });
            setSuccessMessage("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            console.error("Error updating user:", err);
            setError(
                err.response?.data?.message ||
                "Failed to update profile. Please try again."
            );
        } finally {
            setIsModalOpen(false);
        }
    };

    const updateUser = (updateData) => {
        setModalContent({
            title: 'Actualizar Perfil',
            message: '¿Estás seguro de que quieres guardar los cambios en tu perfil?',
            confirmLabel: 'Guardar Cambios',
            confirmStyle: 'btn-primary',
            onConfirm: () => confirmUpdateUser(updateData),
            onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };


  const handleSaveChanges = async () => {
      setError(null);
      setSuccessMessage(null);

    const updateData = {};
    if (newUsername.trim()) {
      updateData.username = newUsername;
    }
    if (newPassword.trim()) {
      updateData.password = newPassword;
    }
    if (photoURL && photoURL !== user.image) {
      updateData.image = photoURL;
    }
    if (newUsername.trim() || newPassword.trim() || photoURL) {
         updateUser(updateData);
    } else {
      setError("Please modify at least one field to save changes.");
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:w-full">
          <div className="flex flex-col m-auto sm:w-300 sm:p-8 sm:items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src={
                photoURL
                  ? photoURL
                  : "https://static-00.iconduck.com/assets.00/avatar-icon-512x512-gu21ei4u.png"
              }
              alt="Profile"
            />
            <div className="flex flex-col justify-between p-4 leading-normal w-full">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {editing ? "Edit Profile" : `${user.username}'s Profile`}
              </h5>
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              {editing ? (
                <>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="input input-bordered mb-4 w-full"
                    placeholder="New Username"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input input-bordered mb-4 w-full"
                    placeholder="New Password"
                  />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="input input-bordered mb-4 w-full"
                    placeholder="Profile Photo URL"
                  />

                  <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Nombre:</strong> {user.name}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Apellidos:</strong> {user.lastname}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Roles:</strong> {user.roles.join(", ")}
                  </p>

                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-secondary"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
       <ModalMensaje
            isOpen={isModalOpen}
            onClose={modalContent.onClose}
            onConfirm={modalContent.onConfirm}
            title={modalContent.title}
            mensaje={modalContent.message}
            confirmLabel={modalContent.confirmLabel}
            confirmStyle={modalContent.confirmStyle}
        />
    </>
  );
};

export default Profile;
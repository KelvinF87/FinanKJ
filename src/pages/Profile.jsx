import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Adjust the path as necessary
import { useNavigate } from "react-router";

const Profile = () => {
  const { isLoggedIn, logOutUser, isLoading, authenticateUser, user } =
    useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(
    user?.photoURL || "/path/to/default-profile-photo.jpg"
  );
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
      if (!isLoggedIn && !isLoading) {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = () => {
    if (photo) {
      setUser({ ...user, photoURL });
      alert("Photo uploaded successfully!");
    }
  };

  const handleSaveChanges = () => {
    if (newUsername.trim() && newPassword.trim()) {
      setUser({
        ...user,
        username: newUsername,
        password: newPassword,
        photoURL,
      });
      alert("Changes saved successfully!");
      setEditing(false);
    } else {
      alert("Please fill in all fields.");
    }
  };
  useEffect(() => {
    console.log("User data:", user);
  }, [user]);
  

  return (
    <>
      {isLoggedIn && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:w-full">
          <div className="flex flex-col m-auto sm:w-300 sm:p-8 sm:items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src={photoURL}
              alt="Profile"
            />
            <div className="flex flex-col justify-between p-4 leading-normal w-full">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {editing ? "Edit Profile" : `${user.username}'s Profile`}
              </h5>
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
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input file-input-bordered w-full max-w-xs mb-4"
                  />
                  <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary"
                  >
                    Save Changes
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
                  {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Created At:</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Last Login:</strong>{" "}
                    {new Date(user.lastLogin).toLocaleString()}
                  </p> */}
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
    </>
  );
};

export default Profile;

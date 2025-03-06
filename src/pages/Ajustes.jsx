import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';  // Import axios for API calls
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URI;

export const Ajustes = () => {
  const storedToken = localStorage.getItem("authToken");
    const [usuario, setUsuario] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [allUsers, setAllUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const { isLoggedIn, logOutUser, isLoading, authenticateUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('admin');
    const [loadingUsers, setLoadingUsers] = useState(false);
    useEffect(() => {
        const verifyAuth = async () => {
            await authenticateUser();
            if (!isLoggedIn && !isLoading) {
                navigate("/login");
            }
        };

        verifyAuth();
    }, [isLoggedIn, isLoading, navigate]);

    useEffect(() => {
      const fetchUsers = async () => {
          if (isAdmin && isLoggedIn) {
              setLoadingUsers(true);
              try {
                  const response = await axios.get(`${API_URL}/api/users`, {
                      headers: { Authorization: `Bearer ${storedToken}` },
                  });
  
                  setAllUsers(response.data);
              } catch (error) {
                  console.error("Error fetching users:", error);
                  toast.error("Failed to fetch users.");
              } finally {
                  setLoadingUsers(false);
              }
          }
      };
  
      fetchUsers();
  }, [isAdmin, isLoggedIn, storedToken, API_URL, user]);  // VERY IMPORTANT

  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: value,
        }));
    };
    const handleDeactivateUser = async (userId) => {
      try {
          const storedToken = localStorage.getItem("authToken");
          await axios.put(
              `${API_URL}/api/users/${userId}`,
              { active: false },  // Assuming the API expects an 'active' field to be toggled
              { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          setAllUsers(prevUsers => prevUsers.map(u => u._id === userId ? { ...u, active: false } : u));  // Optimistic update

          toast.success("User deactivated successfully.");
      } catch (error) {
          console.error("Error deactivating user:", error);
          toast.error("Failed to deactivate user.");
      }
  };

  const handleResetPassword = async (userId) => {
      try {
          const storedToken = localStorage.getItem("authToken");
          await axios.post(
              `${API_URL}/api/users/reset-password/${userId}`, // Ensure this endpoint exists on your backend
              {}, // Typically the backend will generate the random password
              { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          toast.success("Password reset successfully. The user should receive an email.");
      } catch (error) {
          console.error("Error resetting password:", error);
          toast.error("Failed to reset password.");
      }
  };
    const validate = () => {
        const newErrors = {};
        if (!usuario.email) newErrors.email = 'Email is required';
        if (!usuario.password) newErrors.password = 'Password is required';
        if (usuario.password !== usuario.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!usuario.firstName) newErrors.firstName = 'First name is required';
        if (!usuario.lastName) newErrors.lastName = 'Last name is required';
        if (!usuario.phone) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
          try {
              const response = await axios.post(`${API_URL}/api/some-endpoint`, usuario, {
                  headers: { Authorization: `Bearer ${storedToken}` }
              });
              toast.success("User updated successfully!");
              // Optionally, clear the form or redirect
          } catch (error) {
              console.error("Error updating user:", error);
              toast.error("Failed to update user.");
          }
      }
  };

    if (isLoading || loadingUsers) {
        return <div>Loading...</div>;
    }
    if (!isAdmin) {
        return <div className="mockup-window border border-base-300 w-full p-6">
            <p>Acceso denegado. Se requiere rol de administrador.</p>
        </div>;
    }
    return (
        <div className="mockup-window border border-base-300 w-full p-6">

            {isAdmin && isLoggedIn ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Admin Panel</h2>
                        <button onClick={() => navigate('/tipo-entradas/create')} className="btn btn-primary">Crear TipoEntrada</button>
                    </div>

                    <form onSubmit={handleSubmit} className="w-md md:w-xl mx-auto space-y-4">
                        {/* Form Fields */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="email"
                                name="email"
                                id="floating_email"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={usuario.email}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="floating_email"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Email address
                            </label>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                name="password"
                                id="floating_password"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={usuario.password}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="floating_password"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Password
                            </label>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                name="confirmPassword"
                                id="floating_repeat_password"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={usuario.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="floating_repeat_password"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Confirm password
                            </label>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="firstName"
                                    id="floating_first_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={usuario.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="floating_first_name"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Nombre
                                </label>
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="lastName"
                                    id="floating_last_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={usuario.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="floating_last_name"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Apellidos
                                </label>
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="tel"
                                    pattern="[0-9]{9}"
                                    name="phone"
                                    id="floating_phone"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={usuario.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="floating_phone"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Número de teléfono (123456789)
                                </label>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                            Submit
                        </button>
                    </form>

                    {/* User List */}
                    <h2 className="text-xl font-semibold mt-8">Manage Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Roles</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(singleUser => (
                                    <tr key={singleUser._id}>
                                        <td>{singleUser.username}</td>
                                        <td>{singleUser.email}</td>
                                        <td>{singleUser.roles.join(', ')}</td>
                                        <td>{singleUser.active ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button
                                                className="btn btn-xs btn-warning mr-2"
                                                onClick={() => handleResetPassword(singleUser._id)}
                                            >
                                                Reset Password
                                            </button>
                                            <button
                                                className={`btn btn-xs ${singleUser.active ? 'btn-error' : 'btn-success'}`}
                                                onClick={() => handleDeactivateUser(singleUser._id)}
                                            >
                                                {singleUser.active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : <p>Loading or not authorized.</p>}
        </div>
    );
};
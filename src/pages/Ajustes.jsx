import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreateTipoEntradaModal from "../components/CreateTipoEntradaModal";
import { Plus, X } from "lucide-react";  // Import the Plus and X icons from lucide-react

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
    const [tiposEntrada, setTiposEntrada] = useState([]); // State for entry types
    const [errors, setErrors] = useState({});
    const { isLoggedIn, logOutUser, isLoading, authenticateUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('admin');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loadingTiposEntrada, setLoadingTiposEntrada] = useState(false);

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
                    toast.error("No se pudieron cargar los usuarios.");
                } finally {
                    setLoadingUsers(false);
                }
            }
        };

        fetchUsers();
    }, [isAdmin, isLoggedIn, storedToken, API_URL, user]);

    useEffect(() => {
        const fetchTiposEntrada = async () => {
            setLoadingTiposEntrada(true);
            try {
                const response = await axios.get(`${API_URL}/api/tipo-entradas`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setTiposEntrada(response.data);
            } catch (error) {
                console.error("Error fetching entry types:", error);
                toast.error("No se pudieron cargar los tipos de entrada.");
            } finally {
                setLoadingTiposEntrada(false);
            }
        };

        if (isAdmin && isLoggedIn) {
            fetchTiposEntrada();
        }
    }, [isAdmin, isLoggedIn, storedToken, API_URL]);

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
                { active: false },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            setAllUsers(prevUsers => prevUsers.map(u => u._id === userId ? { ...u, active: false } : u));

            toast.success("Usuario desactivado con éxito.");
        } catch (error) {
            console.error("Error al desactivar el usuario:", error);
            toast.error("No se pudo desactivar el usuario.");
        }
    };

    const handleResetPassword = async (userId) => {
        try {
            const storedToken = localStorage.getItem("authToken");
            await axios.post(
                `${API_URL}/api/users/reset-password/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            toast.success("Contraseña restablecida con éxito. Se ha enviado un correo electrónico al usuario.");
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            toast.error("No se pudo restablecer la contraseña.");
        }
    };

    const handleToggleRole = async (userId, newRoles) => {
        try {
            await axios.put(`${API_URL}/api/users/${userId}`, { roles: newRoles }, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });

            setAllUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, roles: newRoles } : user
            ));

            toast.success("Rol de usuario actualizado con éxito.");
        } catch (error) {
            console.error("Error al actualizar el rol de usuario:", error);
            toast.error("No se pudo actualizar el rol de usuario.");
        }
    };
    const handleEntryCreated = (newEntry) => {
        setTiposEntrada(prevEntries => [...prevEntries, newEntry]);
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
                toast.error("No se pudo actualizar el usuario.");
            }
        }
    };

    if (isLoading || loadingUsers || loadingTiposEntrada) {
        return <div>Cargando...</div>;
    }
    if (!isAdmin) {
        return <div className="mockup-window border border-base-300 w-full p-6">
            <p>Acceso denegado. Se requiere rol de administrador.</p>
        </div>;
    }

    return (
        <div className="mockup-window border border-base-300 w-full p-6 relative">  {/* Added relative positioning */}
            {isAdmin && isLoggedIn ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-center w-full">Panel de Administración</h2>
                    </div>

                   <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Nombre de Usuario</th>
                                    <th>Correo Electrónico</th>
                                    <th>Roles</th>
                                    <th>Activo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(singleUser => (
                                    <tr key={singleUser._id}>
                                        <td>{singleUser.username}</td>
                                        <td>{singleUser.email}</td>
                                        <td>{singleUser.roles.join(', ')}</td>
                                        <td>{singleUser.active ? 'Sí' : 'No'}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={singleUser.roles.includes('admin')}
                                                onChange={(e) => {
                                                    const newRoles = e.target.checked ? ['admin', 'user'] : ['user'];
                                                    handleToggleRole(singleUser._id, newRoles);
                                                }}
                                            />
                                            <button
                                                className="btn btn-xs btn-warning mr-2"
                                                onClick={() => handleResetPassword(singleUser._id)}
                                            >
                                                Restablecer Contraseña
                                            </button>
                                            <button
                                                className={`btn btn-xs ${singleUser.active ? 'btn-error' : 'btn-success'}`}
                                                onClick={() => handleDeactivateUser(singleUser._id)}
                                            >
                                                {singleUser.active ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Entry Types List */}
                    <h2 className="text-xl font-semibold mt-8">Tipos de Entrada</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tiposEntrada.map(tipo => (
                                    <tr key={tipo._id}>
                                        <td>{tipo.name}</td>
                                        <td>{tipo.tipo.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Floating Action Button */}
                    <div className="group fixed bottom-0 right-0 p-2 flex items-end justify-end w-24 h-24 ">
                        <div
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 z-50 absolute cursor-pointer transition-transform transform group-hover:scale-110"
                        >
                            <Plus size={24} />
                        </div>
                    </div>

                    <CreateTipoEntradaModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onEntryCreated={handleEntryCreated}
                        API_URL={API_URL}
                        storedToken={storedToken}
                        CloseIcon={X} // Pass the Close icon as a prop
                    />
                </>
            ) : <p>Cargando o no autorizado.</p>}
        </div>
    );
};
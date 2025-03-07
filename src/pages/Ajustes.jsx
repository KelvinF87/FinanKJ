import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreateTipoEntradaModal from "../components/CreateTipoEntradaModal";
import { Plus, X } from "lucide-react";
import Pagination from '../components/Pagination';
import TableSearch from '../components/TableSearch';
import ModalMensaje from '../components/ModalMensaje'; // Import ModalMensaje

const API_URL = import.meta.env.VITE_API_URI;

const ITEMS_PER_PAGE = 10;  // Define items per page here

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

    // Pagination States
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [currentPageTipos, setCurrentPageTipos] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredTiposEntrada, setFilteredTiposEntrada] = useState([]);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmLabel: 'Confirmar',
        confirmStyle: 'btn-error',
        onClose: () => setIsModalOpen(false)
    });
    const [userActionId, setUserActionId] = useState(null);

    const columnsUsers = ['username', 'email', 'roles'];
    const columnsTipos = ['name', 'tipo'];

    const handleSearchUsers = (results) => {
        setFilteredUsers(results);
        setCurrentPageUsers(1);  // Reset to first page after search
    };

    const handleSearchTipos = (results) => {
        setFilteredTiposEntrada(results);
        setCurrentPageTipos(1);  // Reset to first page after search
    };

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
                    setFilteredUsers(response.data);
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
        setFilteredUsers(allUsers)
    }, [allUsers])

    useEffect(() => {
        const fetchTiposEntrada = async () => {
            setLoadingTiposEntrada(true);
            try {
                const response = await axios.get(`${API_URL}/api/tipo-entradas`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setTiposEntrada(response.data);
                 setFilteredTiposEntrada(response.data)
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

     useEffect(() => {
        setFilteredTiposEntrada(tiposEntrada)
    }, [tiposEntrada])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: value,
        }));
    };

   const handleToggleActiveUser = (userId) => {
        // Find the user and get the actual state
        const userToUpdate = allUsers.find((u) => u._id === userId);
        if (!userToUpdate) {
            toast.error("User not found for toggling active state.");
            return;
        }
        const newActiveState = !userToUpdate.active;
        const message = `¿Estás seguro de que quieres ${newActiveState ? 'activar' : 'desactivar'} a este usuario?`;
        setModalContent({
            title: `${newActiveState ? 'Activar' : 'Desactivar'} Usuario`,
            message: message,
            confirmLabel: newActiveState ? 'Activar' : 'Desactivar',
            confirmStyle: newActiveState ? 'btn-success' : 'btn-warning',
            onConfirm: () => confirmToggleActiveUser(userId, newActiveState),
            onClose: () => {
                setIsModalOpen(false);
                setUserActionId(null); // Clear the userId if the modal is closed
            }
        });
        setUserActionId(userId);
        setIsModalOpen(true);
    };

    const confirmToggleActiveUser = async (userId, newActiveState) => {
        try {
            const storedToken = localStorage.getItem("authToken");
            await axios.put(
                `${API_URL}/api/users/${userId}`,
                { active: newActiveState },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            setAllUsers(prevUsers => prevUsers.map(u => u._id === userId ? { ...u, active: newActiveState } : u));
            toast.success(`Usuario ${newActiveState ? 'activado' : 'desactivado'} con éxito.`);
        } catch (error) {
            console.error("Error al actualizar el estado del usuario:", error);
            toast.error("No se pudo actualizar el estado del usuario.");
        } finally {
            setIsModalOpen(false);
            setUserActionId(null); // Clear the userId after action
        }
    };


    const confirmResetPassword = async (userId) => {
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
        } finally{
            setIsModalOpen(false);
        }
    };

    const handleResetPassword = (userId) => {
        setModalContent({
            title: 'Restablecer Contraseña',
            message: '¿Estás seguro de que quieres restablecer la contraseña de este usuario?',
            confirmLabel: 'Restablecer',
            confirmStyle: 'btn-warning',
            onConfirm: () => confirmResetPassword(userId),
            onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    const handleToggleRole = async (userId, newRoles) => {
       try {
        const storedToken = localStorage.getItem("authToken");
        await axios.put(
            `${API_URL}/api/users/${userId}`,
            { roles: newRoles },
            { headers: { Authorization: `Bearer ${storedToken}` } }
        );

        setAllUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, roles: newRoles } : user
            )
        );

        toast.success("Rol de usuario actualizado con éxito.");
    } catch (error) {
        console.error("Error al actualizar el rol de usuario:", error);
        toast.error("No se pudo actualizar el rol de usuario.");
    } finally {
        setIsModalOpen(false);
    }
    };

    const confirmChangeRole = async (userId, newRoles) => {
          try {
          const storedToken = localStorage.getItem("authToken");
          await axios.put(
              `${API_URL}/api/users/${userId}`,
              { roles: newRoles },
              { headers: { Authorization: `Bearer ${storedToken}` } }
          );

          setAllUsers((prevUsers) =>
              prevUsers.map((user) =>
                  user._id === userId ? { ...user, roles: newRoles } : user
              )
          );

          toast.success("Rol de usuario actualizado con éxito.");
         } catch (error) {
          console.error("Error al actualizar el rol de usuario:", error);
          toast.error("No se pudo actualizar el rol de usuario.");
         } finally {
          setIsModalOpen(false);
        }
    };

    const handleToggleRoleDialog = (userId, checked) => {
       const newRoles = checked ? ['admin', 'user'] : ['user'];
       setModalContent({
            title: 'Actualizar Rol de Usuario',
            message: `¿Estás seguro de que quieres ${checked ? 'otorgar' : 'remover'} el rol de administrador a este usuario?`,
            confirmLabel: "Confirmar",
            confirmStyle: "btn-primary",
            onConfirm: () => confirmChangeRole(userId, newRoles),
            onClose: () => setIsModalOpen(false)
        });
      setIsModalOpen(true);
    };
    const handleEntryCreated = (newEntry) => {
        setTiposEntrada(prevEntries => [...prevEntries, newEntry]);
    };

    const validate = () => {
        const newErrors = {};
        if (!usuario.email) newErrors.email = 'Email is required';
        if (!usuario.password) newErrors.password = 'Password is required';
        if (!usuario.password !== usuario.confirmPassword) {
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

     // Calculate pagination for Users
     const indexOfLastUser = currentPageUsers * ITEMS_PER_PAGE;
     const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
     const currentUsers = (filteredUsers.length > 0 ? filteredUsers: allUsers).slice(indexOfFirstUser, indexOfLastUser);
     const totalPagesUsers = Math.ceil((filteredUsers.length > 0 ? filteredUsers: allUsers).length / ITEMS_PER_PAGE);

      // Calculate pagination for TiposEntrada
      const indexOfLastTipo = currentPageTipos * ITEMS_PER_PAGE;
      const indexOfFirstTipo = indexOfLastTipo - ITEMS_PER_PAGE;
      const currentTiposEntrada = (filteredTiposEntrada.length > 0 ? filteredTiposEntrada: tiposEntrada).slice(indexOfFirstTipo, indexOfLastTipo);
      const totalPagesTipos = Math.ceil(tiposEntrada.length / ITEMS_PER_PAGE);

      const handlePageChangeUsers = (page) => {
        setCurrentPageUsers(page);
    };

    const handlePageChangeTipos = (page) => {
        setCurrentPageTipos(page);
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
        <div className="mockup-window border border-base-300 w-full pt-20 sm:pt-0 p-6 relative">  {/* Added relative positioning */}
            {isAdmin && isLoggedIn ? (
                <>
                    <h2 className="text-xl font-semibold text-center w-full sm:w-auto mb-2 sm:mb-0">Panel de Administración</h2>
                    <div className="tabs tabs-lift">
                        <input type="radio" id="tab-usuarios" name="admin_tabs" className="tab" aria-label="Usuarios" defaultChecked />
                        <div className="tab-content bg-base-100 border-base-300 p-6">
                            {/* User List */}
                            <h2 className="text-xl font-semibold mt-8">Administrar Usuarios</h2>
                            <TableSearch data={allUsers} columns={columnsUsers} onSearch={handleSearchUsers} />
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
                                        {currentUsers.map(singleUser => (
                                            <tr key={singleUser._id}>
                                                <td>{singleUser.username}</td>
                                                <td>{singleUser.email}</td>
                                                <td>{singleUser.roles.join(', ')}</td>
                                                <td>{singleUser.active ? 'Sí' : 'No'}</td>
                                                <td className="flex flex-col sm:flex-row items-center justify-center gap-2"> {/* Stack on small screens */}
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={singleUser.roles.includes('admin')}
                                                        onChange={(e) => handleToggleRoleDialog(singleUser._id,e.target.checked)}
                                                    />
                                                    <button
                                                        className="btn btn-xs btn-warning"
                                                        onClick={() => handleResetPassword(singleUser._id)}
                                                    >
                                                        Restablecer Contraseña
                                                    </button>
                                                    <button
                                                        className={`btn btn-xs ${singleUser.active ? 'btn-error' : 'btn-success'}`}
                                                        onClick={() => handleToggleActiveUser(singleUser._id)}
                                                    >
                                                        {singleUser.active ? 'Desactivar' : 'Activar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                             <Pagination
                                currentPage={currentPageUsers}
                                totalPages={totalPagesUsers}
                                onPageChange={handlePageChangeUsers}
                            />
                        </div>

                        <input type="radio" id="tab-tipos" name="admin_tabs" className="tab" aria-label="Tipos de Entrada" />
                        <div className="tab-content bg-base-100 border-base-300 p-6 relative">
                            {/* Entry Types List */}
                            <h2 className="text-xl font-semibold mt-8">Tipos de Entrada</h2>
                             <TableSearch data={tiposEntrada} columns={columnsTipos} onSearch={handleSearchTipos} />
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTiposEntrada.map(tipo => (
                                            <tr key={tipo._id}>
                                                <td>{tipo.name}</td>
                                                <td>{tipo.tipo.join(', ')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={currentPageTipos}
                                totalPages={totalPagesTipos}
                                onPageChange={handlePageChangeTipos}
                            />
                            {/* Floating Action Button - inside the Tipos de Entrada tab */}
                            <div className="group absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-end justify-end w-16 h-16">
                                <div
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 z-50 cursor-pointer transition-transform transform group-hover:scale-110"
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
                        </div>
                    </div>
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
            ) : <p>Cargando o no autorizado.</p>}
        </div>
    );
};
import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";
import { EditModal } from "./EditarModal";
import Pagination from "./Pagination";
import TableSearch from "./TableSearch";  // Import the TableSearch component
import { Delete, Pencil } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URI;
const ITEMS_PER_PAGE = 5;

const ListaIngreso = ({ getIngresos, setCarga, carga }) => {
    const [ingresos, setIngresos] = useState([]);
    const token = localStorage.getItem("authToken");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingresoToDelete, setIngresoToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [ingresoToEdit, setIngresoToEdit] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const[searchTerm, setSearchTerm] = useState("");
    const [filteredIngresos, setFilteredIngresos] = useState([]);

    const columns = ['ingreso', 'tipo.name', 'balance', 'detalles'];
    const handleSearch = (results) => {
        setFilteredIngresos(results);
        setCurrentPage(1); // Reset to first page after search
    };

    useEffect(() => {
        const fetchInitialIngresos = async () => {
            setCarga(prev => !prev);
            try {
                const response = await axios.get(`${API_URL}/api/ingresos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIngresos(response.data);
                setFilteredIngresos(response.data);
            } catch (error) {
                console.error("Error fetching initial ingresos:", error);
                // Consider showing a toast message here
            } finally {
                setCarga(prev => !prev);
            }
        };
        fetchInitialIngresos()
    }, []);

    useEffect(() => {
        setFilteredIngresos(ingresos)
    }, [ingresos])

    // Calculate pagination values
    const indexOfLastIngreso = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstIngreso = indexOfLastIngreso - ITEMS_PER_PAGE;
    const currentIngresos = (filteredIngresos.length > 0 ? filteredIngresos: ingresos).slice(indexOfFirstIngreso, indexOfLastIngreso);
    const totalPages = Math.ceil((filteredIngresos.length > 0 ? filteredIngresos : ingresos).length / ITEMS_PER_PAGE);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (id) => {
        setIngresoToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsModalOpen(false);
        try {
            await axios.delete(`${API_URL}/api/ingresos/${ingresoToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getIngresos(); // Recargar la lista después de eliminar
            setCarga(prev => !prev)
        } catch (error) {
            console.error("Error deleting ingreso:", error);
        }
        setIngresoToDelete(null);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setIngresoToDelete(null);
    };

    const handleEdit = (ingreso) => {
        setIngresoToEdit(ingreso);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setIngresoToEdit(null);
    };

    return (
        <div className="overflow-x-auto w-full sm:px-8 md:px-8 lg:px-8 xl:px-8 sm:max-w-7xx sm:mx-auto">
            <TableSearch data={ingresos} columns={columns} onSearch={handleSearch} />
            <table className="table">
                <thead>
                    <tr className="bg-gray-50 text-gray-600">
                        <th>Ingreso</th>
                        <th>Tipo de Ingreso</th>
                        {/* <th>Balance Actual</th> */}
                        <th>Detalle/Nota</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentIngresos.map((ingreso) => (
                        <tr key={ingreso._id}>
                            <td>{ingreso.ingreso}</td>
                            <td>{ingreso.tipo?.name || "N/A"}</td>
                            {/* <td>{ingreso.balance}</td> */}
                            <td>{ingreso.detalles}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEdit(ingreso)}
                                >
                                    <Pencil />
                                </button>
                                <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => handleDelete(ingreso._id)}
                                >
                                  <Delete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Ingreso</th>
                        <th>Tipo de Ingreso</th>
                        {/* <th>Balance Actual</th> */}
                        <th>Detalle/Nota</th>
                        <th>Acciones</th>
                    </tr>
                </tfoot>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <ModalMensaje
                isOpen={isModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                mensaje="¿Estás seguro de que quieres eliminar este ingreso?"
            />
            <EditModal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                tipoVentana="ingreso"
                getIngresos={getIngresos}
                setCarga={setCarga}
                carga={carga}
                itemToEdit={ingresoToEdit}
            />
        </div>
    );
};

export { ListaIngreso };
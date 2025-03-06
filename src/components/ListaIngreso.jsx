// ListaIngreso.jsx (modificado)
import React, { useState } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";
import { EditModal } from "./EditarModal"; // Importa el componente EditModal

const API_URL = import.meta.env.VITE_API_URI;

const ListaIngreso = ({ ingresos, getIngresos, setCarga, carga }) => {
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la visibilidad del modal de edición
  const [ingresoToEdit, setIngresoToEdit] = useState(null); // Estado para guardar el ingreso a editar

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
    } catch (error) {
      console.error("Error deleting ingreso:", error);
    }
    setIngresoToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setIngresoToDelete(null);
  };

  // Función para abrir el modal de edición y establecer el ingreso a editar
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
      <table className="table">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th>Ingreso</th>
            <th>Tipo de Ingreso</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso._id}>
              <td>{ingreso.ingreso}</td>
              <td>{ingreso.tipo?.name || "N/A"}</td>
              <td>{ingreso.balance}</td>
              <td>{ingreso.detalles}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(ingreso)} // Pasar el objeto ingreso a handleEdit
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(ingreso._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Ingreso</th>
            <th>Tipo de Ingreso</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
            <th>Acciones</th>
          </tr>
        </tfoot>
      </table>
      <ModalMensaje
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        mensaje="¿Estás seguro de que quieres eliminar este ingreso?"
      />
      {/* Renderiza condicionalmente el componente EditModal */}
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
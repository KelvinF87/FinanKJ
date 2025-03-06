import React, { useState } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";
import { EditModal } from "./EditarModal"; // Importa el componente EditModal

const API_URL = import.meta.env.VITE_API_URI;

const ListaGastos = ({ gastos, getGastos, setCarga, carga }) => {
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la visibilidad del modal de edición
  const [gastoToEdit, setGastoToEdit] = useState(null); // Estado para guardar el gasto a editar

  const handleDelete = (id) => {
    setGastoToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      await axios.delete(`${API_URL}/api/gastos/${gastoToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getGastos(); // Recargar la lista después de eliminar
      setCarga(prev => !prev)
    } catch (error) {
      console.error("Error deleting gasto:", error);
    }
    setGastoToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setGastoToDelete(null);
  };

  // Función para abrir el modal de edición y establecer el gasto a editar
  const handleEdit = (gasto) => {
    setGastoToEdit(gasto);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setGastoToEdit(null);
  };

  return (
    <div className="overflow-x-auto w-full sm:px-8 md:px-8 lg:px-8 xl:px-8 sm:max-w-7xx sm:mx-auto">
      <table className="table">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th>Gasto</th>
            <th>Tipo de Gasto</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto._id}>
              <td>{gasto.gasto}</td>
              <td>{gasto.tipo?.name || "N/A"}</td>
              <td>{gasto.balance}</td>
              <td>{gasto.detalles}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(gasto)} // Pasar el objeto gasto a handleEdit
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(gasto._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Gasto</th>
            <th>Tipo de Gasto</th>
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
        mensaje="¿Estás seguro de que quieres eliminar este gasto?"
      />
      {/* Renderiza condicionalmente el componente EditModal */}
      <EditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        tipoVentana="gasto"
        getGastos={getGastos}
        setCarga={setCarga}
        carga={carga}
        itemToEdit={gastoToEdit}
      />
    </div>
  );
};

export { ListaGastos };
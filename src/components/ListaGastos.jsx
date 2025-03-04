// ListaGastos.jsx (modificado)
import React, { useState } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";

const API_URL = import.meta.env.VITE_API_URI;

const ListaGastos = ({ gastos, getGastos }) => {
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);

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
    } catch (error) {
      console.error("Error deleting gasto:", error);
    }
    setGastoToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setGastoToDelete(null);
  };

  const handleEdit = (id) => {
    // TODO: Implementar la lógica para editar
    console.log(`Editing gasto with ID: ${id}`);
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
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(gasto._id)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(gasto._id)}>
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
    </div>
  );
};

export { ListaGastos };
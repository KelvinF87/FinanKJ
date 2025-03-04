// ListaIngreso.jsx (modificado)
import React, { useState } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";

const API_URL = import.meta.env.VITE_API_URI;

const ListaIngreso = ({ ingresos, getIngresos }) => {
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);

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

  const handleEdit = (id) => {
    // TODO: Implementar la lógica para editar
    console.log(`Editing ingreso with ID: ${id}`);
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
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(ingreso._id)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(ingreso._id)}>
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
    </div>
  );
};

export { ListaIngreso };
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ModalMensaje from "./ModalMensaje";
import { EditModal } from "./EditarModal";
import Pagination from "./Pagination";
import TableSearch from "./TableSearch";
import { Delete, Pencil } from "lucide-react";
import { CargaContext } from "../contexts/LoadContext";

const API_URL = import.meta.env.VITE_API_URI;
const ITEMS_PER_PAGE = 5;

const ListaGastos = () => {
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gastoToEdit, setGastoToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { refreshData, gastos } = useContext(CargaContext);

  const columns = ["gasto", "tipo.name", "detalles"];
  const handleSearch = (results) => {
    setFilteredGastos(results);
    setCurrentPage(1);
  };
  useEffect(() => {
    setFilteredGastos(gastos)
  }, [gastos]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
   // Calculate pagination values
   const indexOfLastGasto = currentPage * ITEMS_PER_PAGE;
   const indexOfFirstGasto = indexOfLastGasto - ITEMS_PER_PAGE;
   const currentGastos = (filteredGastos.length > 0 ? filteredGastos: gastos).slice(indexOfFirstGasto, indexOfLastGasto);
   const totalPages = Math.ceil((filteredGastos.length > 0 ? filteredGastos : gastos).length / ITEMS_PER_PAGE);

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
      refreshData();
    } catch (error) {
      console.error("Error deleting gasto:", error);
    }
    setGastoToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setGastoToDelete(null);
  };

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
      <TableSearch data={gastos} columns={columns} onSearch={handleSearch} />
      {loading && (
        <div className="w-full flex justify-center">
          <span className="loading w-70 loading-bars"></span>
        </div>
      )}

      {!loading && (
        <table className="table">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th>Gasto</th>
              <th>Tipo de Gasto</th>
              <th>Detalle/Nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentGastos.map((gasto) => (
              <tr key={gasto._id}>
                <td>{gasto.gasto}</td>
                <td>{gasto.tipo?.name || "N/A"}</td>
                <td>{gasto.detalles}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(gasto)}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(gasto._id)}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Gasto</th>
              <th>Tipo de Gasto</th>
              <th>Detalle/Nota</th>
              <th>Acciones</th>
            </tr>
          </tfoot>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ModalMensaje
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        mensaje="¿Estás seguro de que quieres eliminar este gasto?"
      />
      <EditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        tipoVentana="gasto"
        refreshData={refreshData}
        itemToEdit={gastoToEdit}
      />
    </div>
  );
};

export { ListaGastos };
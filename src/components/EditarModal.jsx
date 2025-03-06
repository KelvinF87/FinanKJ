// EditModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CircleDollarSign, Check, Ban } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

export const EditModal = ({
  open,
  onClose,
  tipoVentana,
  getIngresos,
  getGastos,
  setCarga,
  carga,
  itemToEdit, // El objeto a editar (ingreso o gasto)
}) => {
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    valor: "",
    tipo: "",
    detalles: "",
  });
  const [tiposEntrada, setTiposEntrada] = useState([]);

  // UseEffect para poblar el formulario con los datos del elemento a editar
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        valor: itemToEdit.ingreso || itemToEdit.gasto || "", // Usar ingreso para Ingresos, gasto para Gastos
        tipo: itemToEdit.tipo?._id || "", // Usar el ID del tipo si existe
        detalles: itemToEdit.detalles || "",
      });
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      valor: parseFloat(formData.valor),
      tipo: formData.tipo,
      detalles: formData.detalles,
    };

    if (tipoVentana === "ingreso") {
      updateIngreso(itemToEdit._id, dataToSend);
    } else {
      updateGasto(itemToEdit._id, dataToSend);
    }

    onClose();
  };

  // Funciones para actualizar ingresos y gastos
  const updateIngreso = (id, data) => {
    axios
      .put(
        `${API_URL}/api/ingresos/${id}`,
        { ingreso: data.valor, tipo: data.tipo, detalles: data.detalles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("Ingreso actualizado:", response.data);
        getIngresos();
        setCarga(!carga);
      })
      .catch((error) => console.error("Error al actualizar ingreso:", error));
  };

  const updateGasto = (id, data) => {
    axios
      .put(
        `${API_URL}/api/gastos/${id}`,
        { gasto: data.valor, tipo: data.tipo, detalles: data.detalles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("Gasto actualizado:", response.data);
        getGastos();
        setCarga(!carga);
      })
      .catch((error) => console.error("Error al actualizar gasto:", error));
  };

  const fetchTiposEntrada = () => {
    axios
      .get(`${API_URL}/api/tipo-entradas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Filtrar los tipos de entrada basándose en si es ingreso o gasto
        const filteredTipos = response.data.filter((item) => {
          if (tipoVentana === "ingreso") {
            return item.tipo.includes("Ingreso"); // Ajusta esto según la estructura real de tu objeto
          } else {
            return item.tipo.includes("Gasto"); // Ajusta esto según la estructura real de tu objeto
          }
        });
        setTiposEntrada(filteredTipos);
      })
      .catch((error) =>
        console.error("Error al obtener tipos de entrada:", error)
      );
  };

  useEffect(() => {
    if (open) {
      // Solo cargar si el modal está abierto
      fetchTiposEntrada();
    }
  }, [open, tipoVentana]);

  return (
    <Dialog onClose={onClose} open={open} className="fixed z-10 inset-0">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                <CircleDollarSign />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900 py-9"
                >
                  {tipoVentana === "ingreso"
                    ? "Editar Ingreso"
                    : "Editar Gasto"}
                </DialogTitle>
                <div className="mt-3">
                  <form onSubmit={handleSubmit} className="m-auto w-90">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="number"
                          name="valor"
                          id="floating_ingreso"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.valor}
                          onChange={handleChange}
                          required
                        />
                        <label
                          htmlFor="floating_ingreso"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-1/2 start-0 top-0/8 peer-focus:-translate-y-2/2 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base"
                        >
                          {tipoVentana === "ingreso"
                            ? "Valor del ingreso"
                            : "Valor del gasto"}
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <select
                          name="tipo"
                          id="floating_select"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          value={formData.tipo}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            Selecciona un tipo
                          </option>
                          {tiposEntrada.map((tipoEntrada) => (
                            <option
                              key={tipoEntrada._id}
                              value={tipoEntrada._id}
                            >
                              {tipoEntrada.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="floating_select"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-1/2 start-0 top-0/8 peer-focus:-translate-y-2/2 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base"
                        >
                          {tipoVentana === "ingreso"
                            ? " Tipo de ingreso"
                            : " Tipo de gasto"}
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <textarea
                          name="detalles"
                          id="floating_nota"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.detalles}
                          onChange={handleChange}
                          required
                        />
                        <label
                          htmlFor="floating_nota"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-1/2 start-0 top-0/8 peer-focus:-translate-y-2/2 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base"
                        >
                          Nota
                        </label>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex duration-300 w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        <Check />
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-red-500 sm:mt-0 sm:w-auto"
                      >
                        <Ban />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
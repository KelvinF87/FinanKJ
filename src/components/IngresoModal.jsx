import React, { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  CircleDollarSign,
  Check,
  Ban,
} from "lucide-react";

export const IngresoModal = ({ open, onClose, tipo }) => {
  const [formData, setFormData] = useState({
    valor: '',
    tipoSeleccionado: '',
    nota: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data submitted:', formData);
    onClose(); // Close the modal after submission
  };

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
                  {tipo === "ingreso" ? "Agregar Ingresos" : "Agregar Gastos"}
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
                          {tipo === "ingreso" ? "Valor del ingreso" : "Valor del gasto"}
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <select
                          name="tipoSeleccionado"
                          id="floating_select"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          value={formData.tipoSeleccionado}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>Selecciona una opción</option>
                          {tipo === "ingreso" ? (
                            <option value="sueldo">Sueldo</option>
                          ) : (
                            <option value="agua">Agua</option>
                          )}
                        </select>
                        <label
                          htmlFor="floating_select"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-1/2 start-0 top-0/8 peer-focus:-translate-y-2/2 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base"
                        >
                          {tipo === "ingreso" ? " Tipo de ingreso" : " Tipo de gasto"}
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <textarea
                          name="nota"
                          id="floating_nota"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.nota}
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

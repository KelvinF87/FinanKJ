// src/components/CreateTipoEntradaModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateTipoEntradaModal = ({ isOpen, onClose, onEntryCreated, API_URL, storedToken }) => {
    const [newEntryName, setNewEntryName] = useState('');
    const [newEntryType, setNewEntryType] = useState(['Gasto']); // Default to 'Gasto'

    const handleCreateEntry = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/tipo-entradas`,
                { name: newEntryName, tipo: newEntryType },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            toast.success("Entry type created successfully!");
            onEntryCreated(response.data); // Notify parent to update list
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error creating entry type:", error);
            toast.error("Failed to create entry type.");
        }
    };

    if (!isOpen) return null;

    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg"> Crear Nuevo Tipo de Entrada</h3>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Nombrede Entrada</span>
            </label>
            <input
              type="text"
              placeholder="Nombre de Entrada"
              className="input input-bordered w-full"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
            />
            <label className="label">
              <span className="label-text">Tipo de Entrada</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newEntryType[0]}
              onChange={(e) => setNewEntryType([e.target.value])}
            >
              <option value="Gasto">Gasto</option>
              <option value="Ingreso">Ingreso</option>
            </select>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleCreateEntry}>
              Crear
            </button>
          </div>
        </div>
      </div>
    );
};

export default CreateTipoEntradaModal;
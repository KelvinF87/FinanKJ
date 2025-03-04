// ModalMensaje.jsx
import React from "react";

const ModalMensaje = ({ isOpen, onClose, onConfirm, mensaje }) => {
  return (
    <dialog id="confirmar_eliminacion_modal" className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Advertencia!</h3>
        <p className="py-4">{mensaje}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-error" onClick={onConfirm}>
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalMensaje;
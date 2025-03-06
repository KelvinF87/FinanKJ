import React from "react";

const ModalMensaje = ({
    isOpen,
    onClose,
    onConfirm,
    mensaje,
    title = "Advertencia",  // Default title
    confirmLabel = "Confirmar", // Default confirm button label
    confirmStyle = "btn-error"   // Default confirm button style (error)
}) => {
    return (
        <dialog id="mensaje_modal" className="modal" open={isOpen}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{mensaje}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-ghost" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className={`btn ${confirmStyle}`} onClick={onConfirm}>
                            {confirmLabel}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ModalMensaje;
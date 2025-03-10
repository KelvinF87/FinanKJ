import { useEffect, useState } from "react";
export const ModalReset = ({ isOpen, onClose, onConfirm }) => {
  const [miEmail, setMiEmail] = useState("");
  return (
    <>
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle"
        open={isOpen}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Restablecer Contraseña</h3>
          <p className="py-4">
           Escriba su correo para recuperar contraseña
          </p>
          <div className="modal-action">
            <form className="w-full" method="dialog" onSubmit={(e) => e.preventDefault()}>
              <input
                className="input input-primary w-full mb-7"
                type="email"
                value={miEmail}
                onChange={(e) => setMiEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                required
              />
              <button
                type="button"
                className="btn bg-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="btn bg-primary"
                onClick={() => onConfirm(miEmail)}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

// Gastos.jsx
import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { IngresoModal } from "../components/IngresoModal";
import { ListaGastos } from "../components/ListaGastos";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

export const Gastos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastos, setGastos] = useState([]);
  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [carga, setCarga] = useState(false);

  const getGastos = () => {
    axios
      .get(`${API_URL}/api/gastos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGastos(response.data);
      })
      .catch((error) => console.error("Error fetching gastos:", error));
  };

  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
      if (!isLoggedIn && !isLoading) {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      // Solo obtener los gastos si el usuario está autenticado
      getGastos();
    }
  }, [isLoggedIn, carga]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="mockup-window border border-base-300 w-full pt-20 sm:pt-0">
          <IngresoModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tipoVentana={"gasto"}
            getIngresos={getGastos}
            setCarga={setCarga}
            carga={carga}
          />

          <ListaGastos gastos={gastos} getGastos={getGastos} setCarga={setCarga} carga={carga}/>
          <div className="group fixed bottom-0 right-0 p-2  flex items-end justify-end w-24 h-24 ">
            <div
              onClick={() => setIsModalOpen(true)}
              className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 z-50 absolute  "
            >
              <Plus />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
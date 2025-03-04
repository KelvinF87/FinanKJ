// Ingresos.jsx
import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { IngresoModal } from "../components/IngresoModal";
import { ListaIngreso } from "../components/ListaIngreso";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

export const Ingresos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [carga, setCarga] = useState(false);

  const getIngresos = () => {
    axios
      .get(`${API_URL}/api/ingresos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIngresos(response.data);
      })
      .catch((error) => console.error("Error fetching ingresos:", error));
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
      // Solo obtener los ingresos si el usuario está autenticado
      getIngresos();
    }
  }, [isLoggedIn, carga]);  // Dependencia en 'isLoggedIn' para cargar al inicio

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="mockup-window border border-base-300 w-full">
          <IngresoModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tipoVentana={"ingreso"}
            getIngresos={getIngresos}
            setCarga={setCarga}
            carga={carga}
          />

          <ListaIngreso ingresos={ingresos} getIngresos={getIngresos} />
          <div className="group fixed bottom-0 right-0 p-2  flex items-end justify-end w-24 h-24 ">
            <div
              onClick={() => setIsModalOpen(true)}
              className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 z-50 absolute  "
            >
              <Plus />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
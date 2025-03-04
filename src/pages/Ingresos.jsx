import { useContext, useEffect, useState } from "react";
import { Plus, CircleDollarSign, Receipt } from "lucide-react";
import { IngresoModal } from "../components/IngresoModal";
import { ListaIngreso } from "../components/ListaIngreso";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export const Ingresos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, logOutUser, isLoading, authenticateUser } =
    useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
      if (!isLoggedIn && !isLoading) {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [isLoggedIn, isLoading, navigate]);

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
            tipo={"ingreso"}
          />

          <ListaIngreso />
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

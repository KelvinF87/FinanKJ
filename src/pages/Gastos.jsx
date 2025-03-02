import { useEffect, useState } from "react";
import { Plus, CircleDollarSign, Receipt } from "lucide-react";
import { IngresoModal } from "../components/IngresoModal";
import { ListaGastos } from "../components/ListaGastos";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';


export const Gastos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout, login,token } = useAuth();
  const navigate=useNavigate();
    useEffect(() => {
      // login('admin', 'password');
      console.log('User logged in', token);
      if (!token) {
        console.log('User not logged in');
        navigate('/login');
  
      }
    }, [token]);
  return (
    <>
   <IngresoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    { token &&    <div className="mockup-window border border-base-300 w-full">
        <ListaGastos />
        <div className="group fixed bottom-0 right-0 p-2  flex items-end justify-end w-24 h-24 ">
          <div
            onClick={() => setIsModalOpen(true)}
            className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 z-50 absolute  "
          >
            <Plus />
          </div>
        </div>
      </div>}
    </>
  );
};

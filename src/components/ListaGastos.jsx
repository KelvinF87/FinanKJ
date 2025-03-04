import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CargaContext } from "../contexts/LoadContext";

// const gastos = [
//   {
//     tipo: "↙️",
//     gasto: 1500,
//     tipoDeGasto: "Rent",
//     balanceActual: 13500,
//     detalleNota: "Monthly rent payment",
//   },
//   {
//     tipo: "↙️",
//     gasto: 2000,
//     tipoDeGasto: "Utilities",
//     balanceActual: 11500,
//     detalleNota: "Electricity and water bills",
//   },
//   {
//     tipo: "↙️",
//     gasto: 1200,
//     tipoDeGasto: "Groceries",
//     balanceActual: 10300,
//     detalleNota: "Weekly grocery shopping",
//   },
//   {
//     tipo: "↙️",
//     gasto: 800,
//     tipoDeGasto: "Transportation",
//     balanceActual: 9500,
//     detalleNota: "Monthly bus pass",
//   },
//   {
//     tipo: "↙️",
//     gasto: 500,
//     tipoDeGasto: "Entertainment",
//     balanceActual: 9000,
//     detalleNota: "Movie tickets and dinner",
//   },
//   {
//     tipo: "↙️",
//     gasto: 300,
//     tipoDeGasto: "Subscriptions",
//     balanceActual: 8700,
//     detalleNota: "Monthly streaming services",
//   },
// ];
// /api/gastos
const API_URL = import.meta.env.VITE_API_URI;
export const ListaGastos = () => {
  const token = localStorage.getItem("authToken");
  const [gastos, setGastos] = useState([]);
  const { carga, setCarga } = useContext(CargaContext);
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
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getGastos();
  }, []);

  return (
    <div className="overflow-x-auto w-full sm:px-8 md:px-8 lg:px-8 xl:px-8 sm:max-w-7xx sm:mx-auto">
      <table className="table">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th>Gasto</th>
            <th>Tipo de Gasto</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto._id}>
              <td>{gasto.gasto}</td>
              <td>{gasto.tipo.name}</td>
              <td>{gasto.balance}</td>
              <td>{gasto.detalles}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Gasto</th>
            <th>Tipo de Gasto</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

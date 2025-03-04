// const ingresos = [
//   {
//     tipo: '↗️',
//     ingreso: 5000,
//     tipoDeIngreso: 'Salary',
//     balanceActual: 15000,
//     detalleNota: 'Monthly salary',
//   },
//   {
//     tipo: '↗️',
//     ingreso: 6000,
//     tipoDeIngreso: 'Salary',
//     balanceActual: 18000,
//     detalleNota: 'Monthly salary',
//   },
//   {
//     tipo: '↗️',
//     ingreso: 4500,
//     tipoDeIngreso: 'Commission',
//     balanceActual: 12000,
//     detalleNota: 'Monthly commission',
//   },
//   {
//     tipo: '↗️',
//     ingreso: 5500,
//     tipoDeIngreso: 'Salary',
//     balanceActual: 16000,
//     detalleNota: 'Monthly salary',
//   },
//   {
//     tipo: '↙️',
//     ingreso: 4000,
//     tipoDeIngreso: 'Salary',
//     balanceActual: 10000,
//     detalleNota: 'Monthly salary',
//   },
//   {
//     tipo: '↗️',
//     ingreso: 7000,
//     tipoDeIngreso: 'Salary',
//     balanceActual: 20000,
//     detalleNota: 'Monthly salary',
//   },
// ];

import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URI;
export const ListaIngreso = () => {
  const token = localStorage.getItem("authToken");
  const [ingresos, setIngresos] = useState([]);

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
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getIngresos();
  }, []);
  return (
    // <ul role="list" className="divide-y divide-gray-100">
    //   {people.map((person) => (
    //     <li key={person.email} className="flex justify-between gap-x-6 py-5">
    //       <div className="flex min-w-0 gap-x-4">
    //         <img alt="" src={person.imageUrl} className="size-12 flex-none rounded-full bg-gray-50" />
    //         <div className="min-w-0 flex-auto">
    //           <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
    //           <p className="mt-1 truncate text-xs/5 text-gray-500">{person.email}</p>
    //         </div>
    //       </div>
    //       <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
    //         <p className="text-sm/6 text-gray-900">{person.role}</p>
    //         {person.lastSeen ? (
    //           <p className="mt-1 text-xs/5 text-gray-500">
    //             Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
    //           </p>
    //         ) : (
    //           <div className="mt-1 flex items-center gap-x-1.5">
    //             <div className="flex-none rounded-full bg-emerald-500/20 p-1">
    //               <div className="size-1.5 rounded-full bg-emerald-500" />
    //             </div>
    //             <p className="text-xs/5 text-gray-500">Online</p>
    //           </div>
    //         )}
    //       </div>
    //     </li>
    //   ))}
    // </ul>
    <div className="overflow-x-auto w-full sm:px-8 md:px-8 lg:px-8 xl:px-8 sm:max-w-7xx sm:mx-auto">
      <table className="table">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th>Ingreso</th>
            <th>Tipo de Ingreso</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso._id}>
              <td>
                {ingreso.tipo} {ingreso.ingreso}
              </td>
              <td>{ingreso.tipo.name}</td>
              <td>{ingreso.balance}</td>
              <td>{ingreso.detalles}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Ingreso</th>
            <th>Tipo de Ingreso</th>
            <th>Balance Actual</th>
            <th>Detalle/Nota</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

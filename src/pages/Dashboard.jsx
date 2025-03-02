import React, { use, useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const monedas = "€";

const estadisticas = {
  ingresos: {
    title: "Ingresos",
    value: 2000,
    description: "From January 1st to February 1st",
  },
  gastos: {
    title: "Gastos",
    value: 4200,
    description: "↗︎ 40 (2%)",
    isSecondary: true,
  },
  gastosFijos: {
    title: "Gastos Fijos",
    value: 1200,
    description: "↘︎ 90 (14%)",
  },
  balance: {
    title: "Balance",
    value: 2200,
    description: "↘︎ 90 (14%)",
    isSecondary: true,
  },
};

export const Dashboard = () => {
  const { logout, login, token } = useAuth();
  const [typeChart, setTypeChart] = useState("bar");
  const [ingresosChartOptions, setIngresosChartOptions] = useState({
    data: [
      { month: "Jan", ingresos: 162000 },
      { month: "Mar", ingresos: 302000 },
      { month: "May", ingresos: 800000 },
      { month: "Jul", ingresos: 1254000 },
      { month: "Sep", ingresos: 950000 },
      { month: "Nov", ingresos: 200000 },
    ],
    series: [
      { type: typeChart.toLowerCase(), xKey: "month", yKey: "ingresos" },
    ],
  });

  const [gastosChartOptions, setGastosChartOptions] = useState({
    data: [
      { month: "Jan", gastos: 100000 },
      { month: "Mar", gastos: 200000 },
      { month: "May", gastos: 300000 },
      { month: "Jul", gastos: 400000 },
      { month: "Sep", gastos: 350000 },
      { month: "Nov", gastos: 150000 },
    ],
    series: [{ type: typeChart.toLowerCase(), xKey: "month", yKey: "gastos" }],
  });
  const navigate = useNavigate();
  useEffect(() => {
    setIngresosChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        { type: typeChart.toLowerCase(), xKey: "month", yKey: "ingresos" },
      ],
    }));

    setGastosChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        { type: typeChart.toLowerCase(), xKey: "month", yKey: "gastos" },
      ],
    }));
  }, [typeChart]);

  const controlType = (e) => {
    setTypeChart(e.target.value);
  };

  useEffect(() => {
    // login('admin', 'password');
    console.log("User logged in", token);
    if (!token) {
      console.log("User not logged in");
      navigate("/login");
    }
  }, [token]);

  return (
    <>
{  token && <div className="p-9 w-full text-center">
        {/* <button onClick={logout} className="btn btn-error mb-4">
          Logout
        </button> */}
        <div className="stats shadow p-9 w-full">
          {Object.keys(estadisticas).map((key) => (
            <div key={key} className="stat place-items-center">
              <div className="stat-title">{estadisticas[key].title}</div>
              <div
                className={`stat-value ${
                  estadisticas[key].isSecondary ? "text-secondary" : ""
                }`}
              >
                {estadisticas[key].value}
                {monedas}
              </div>
              <div
                className={`stat-desc ${
                  estadisticas[key].isSecondary ? "text-secondary" : ""
                }`}
              >
                {estadisticas[key].description}
              </div>
            </div>
          ))}
        </div>
        <select
          className="select select-bordered w-full sm:w-xs my-9 select-lg"
          value={typeChart}
          onChange={controlType}
        >
          <option disabled>Tipo de Gráficos</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        <div className="bg-auto flex flex-row justify-center items-center flex-wrap gap-6 sm:gap-0">
          <div className="w-full sm:w-140">
            <h2 className="stat-value sm:text-left text-center">Ingresos</h2>
            <AgCharts options={ingresosChartOptions} />
          </div>
          <div className="w-full sm:w-140">
            <h2 className="stat-value text-secondary sm:text-left text-center">
              Gastos
            </h2>
            <AgCharts options={gastosChartOptions} />
          </div>
        </div>
      </div>}
    </>
  );
};

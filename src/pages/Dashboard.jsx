import React, { useContext, useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;
const monedas = "€";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Use locale-specific formatting
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export const Dashboard = () => {
  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [typeChart, setTypeChart] = useState("bar");
  const [ingresosChartOptions, setIngresosChartOptions] = useState({
    data: [],
    series: [{ type: "bar", xKey: "month", yKey: "ingresos" }],
  });
  const [gastosChartOptions, setGastosChartOptions] = useState({
    data: [],
    series: [{ type: "bar", xKey: "month", yKey: "gastos" }],
  });
  const [estadisticas, setEstadisticas] = useState({
    ingresos: {
      title: "Ingresos",
      value: 0,
      description: "",
    },
    gastos: {
      title: "Gastos",
      value: 0,
      description: "",
      isSecondary: true,
    },
    gastosFijos: {
      title: "Gastos Fijos",
      value: 0,
      description: "",
    },
    balance: {
      title: "Balance",
      value: 0,
      description: "",
      isSecondary: true,
    },
  });
  const [dateRange, setDateRange] = useState({
    startDate: getFirstDayOfYear(), // set initial start date
    endDate: getCurrentDate(), // set initial end date
  });

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
      fetchDashboardData();
    }
  }, [isLoggedIn, dateRange]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { startDate, endDate } = dateRange;

      // Fetch balance
      const allinfoResponse = await axios.get(
        `${API_URL}/api/reports/alldata`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { balance, expenses, incomes } = allinfoResponse.data;

      // Process expenses data for chart
      const processedExpensesData = expenses.map((item) => ({
        month: formatDate(item._id),
        gastos: item.total,
      }));

      // Process income data for chart
      const processedIncomeData = incomes.map((item) => ({
        month: formatDate(item._id),
        ingresos: item.total,
      }));

      // Update chart options
      setGastosChartOptions((prevOptions) => ({
        ...prevOptions,
        data: processedExpensesData,
      }));

      setIngresosChartOptions((prevOptions) => ({
        ...prevOptions,
        data: processedIncomeData,
      }));

      // Update estadisticas with fetched data
      setEstadisticas((prevEstadisticas) => {
        console.log(balance);
        console.log(expenses);
        console.log(incomes);
        return {
          ...prevEstadisticas,
          ingresos: {
            ...prevEstadisticas.ingresos,
            value: incomes.reduce((acc, curr) => acc + curr.total, 0),
            description: `From ${formatDate(startDate)} to ${formatDate(
              endDate
            )}`,
          },
          gastos: {
            ...prevEstadisticas.gastos,
            value: expenses.reduce((acc, curr) => acc + curr.total, 0),
            description: `From ${formatDate(startDate)} to ${formatDate(
              endDate
            )}`,
          },
          balance: {
            ...prevEstadisticas.balance,
            value: balance,
            description: "Current Balance",
          },
        };
      });
      console.log(balance);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>

          {/* Stats Display */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold text-gray-700">Ingresos</h2>
                <p className="text-2xl font-bold text-blue-500">
                  {estadisticas.ingresos.value}
                  {monedas}
                </p>
                <p className="text-sm text-gray-500">
                  {estadisticas.ingresos.description}
                </p>
              </div>
              <div className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold text-gray-700">Gastos</h2>
                <p className="text-2xl font-bold text-red-500">
                  {estadisticas.gastos.value}
                  {monedas}
                </p>
                <p className="text-sm text-gray-500">
                  {estadisticas.gastos.description}
                </p>
              </div>
        
              <div className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
                <p className="text-2xl font-bold text-green-500">
                  {estadisticas.balance.value}
                  {monedas}
                </p>
                <p className="text-sm text-gray-500">
                  {estadisticas.balance.description}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center justify-center mb-6">
            <div className="mr-4">
              <label
                htmlFor="startDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="flex justify-center mb-6">
            <label
              htmlFor="chartType"
              className="mr-4 text-gray-700 text-sm font-bold"
            >
              Chart Type:
            </label>
            <select
              id="chartType"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={typeChart}
              onChange={controlType}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
            </select>
          </div>

          {/* Charts Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Ingresos
              </h2>
              {ingresosChartOptions.data.length > 0 ? (
                <AgCharts options={ingresosChartOptions} />
              ) : (
                <p className="text-gray-500 text-center">No data to display</p>
              )}
            </div>

            <div className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Gastos
              </h2>
              {gastosChartOptions.data.length > 0 ? (
                <AgCharts options={gastosChartOptions} />
              ) : (
                <p className="text-gray-500 text-center">No data to display</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFirstDayOfYear() {
  const now = new Date();
  const year = now.getFullYear();
  return `${year}-01-01`;
}

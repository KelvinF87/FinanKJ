import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CargaContext = createContext();

function CargaProvider({ children }) {
  const [carga, setCarga] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const API_URL = import.meta.env.VITE_API_URI;

  useEffect(() => {
    localStorage.setItem("authToken", authToken);
  }, [authToken]);

  const fetchIngresos = useCallback(async () => {
    if (!authToken) {
      console.warn("No auth token found. Skipping fetchIngresos.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/ingresos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setIngresos([...response.data]); // Create a new array
    } catch (error) {
      console.error("Error fetching ingresos:", error);
    }
  }, [authToken, API_URL]);

  const fetchGastos = useCallback(async () => {
    if (!authToken) {
      console.warn("No auth token found. Skipping fetchGastos.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/gastos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setGastos([...response.data]); // Create a new array
    } catch (error) {
      console.error("Error fetching gastos:", error);
    }
  }, [authToken, API_URL]);

  const refreshData = useCallback(async () => {
    setCarga(true);
    try {
      await Promise.all([fetchIngresos(), fetchGastos()]);
    } finally {
      setCarga(false);
    }
  }, [fetchIngresos, fetchGastos]);

  const createIngreso = useCallback(async (newIngreso) => {
    try {
      await axios.post(`${API_URL}/api/ingresos`, newIngreso, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error creating ingreso:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const createGasto = useCallback(async (newGasto) => {
    try {
      await axios.post(`${API_URL}/api/gastos`, newGasto, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error creating gasto:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const updateIngreso = useCallback(async (id, updatedIngreso) => {
    try {
      await axios.put(`${API_URL}/api/ingresos/${id}`, updatedIngreso, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error updating ingreso:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const updateGasto = useCallback(async (id, updatedGasto) => {
    try {
      await axios.put(`${API_URL}/api/gastos/${id}`, updatedGasto, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error updating gasto:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const deleteIngreso = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/ingresos/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error deleting ingreso:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const deleteGasto = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/gastos/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      await refreshData();
    } catch (error) {
      console.error("Error deleting gasto:", error);
    }
  }, [authToken, API_URL, refreshData]);

  const resetPassword = useCallback(async (email) => {
    try {
      await axios.post(`${API_URL}/api/users/reset-pass/${email}`);
      await refreshData();
    } catch (error) {
      console.error("Error reset password:", error);
    }
  }, [API_URL, refreshData]);
  return (
    <CargaContext.Provider
      value={{
        carga,
        setCarga,
        ingresos,
        gastos,
        refreshData,
        createIngreso,
        createGasto,
        updateIngreso,
        updateGasto,
        deleteIngreso,
        deleteGasto,
        setAuthToken,
        resetPassword,
      }}
    >
      {children}
    </CargaContext.Provider>
  );
}

export { CargaContext, CargaProvider };
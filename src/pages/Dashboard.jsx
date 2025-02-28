import { AgCharts } from "ag-charts-react";
// import { AgChartsReact } from "ag-charts-react";
import { useEffect, useState } from "react";


const monedas = "€";

export const Dashboard = () => {
  const [typeChart, setTypeChart] = useState("bar");
  const [chartOptions, setChartOptions] = useState({
    data: [
      { month: "Jan", avgTemp: 2.3, iceCreamSales: 162000 },
      { month: "Mar", avgTemp: 6.3, iceCreamSales: 302000 },
      { month: "May", avgTemp: 16.2, iceCreamSales: 800000 },
      { month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: "Sep", avgTemp: 14.5, iceCreamSales: 950000 },
      { month: "Nov", avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    graficos: [
      { type: "Bar" },
      { type: "Line" },

    ],
    series: [{ type: typeChart.toLowerCase(), xKey: "month", yKey: "iceCreamSales" }],
  });

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [{ type: typeChart.toLowerCase(), xKey: "month", yKey: "iceCreamSales" }],
    }));
  }, [typeChart]);

  const controlType = (e) => {
    setTypeChart(e.target.value);
  };

  return (
    <div className="p-9 w-full">
      <div className="stats shadow p-9 w-full">
        <div className="stat place-items-center">
          <div className="stat-title">Ingresos</div>
          <div className="stat-value">2,000{monedas}</div>
          <div className="stat-desc">From January 1st to February 1st</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Gastos</div>
          <div className="stat-value text-secondary">4,200{monedas}</div>
          <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Gastos Fijos</div>
          <div className="stat-value">1,200{monedas}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <select className="select select-bordered w-full max-w-xs" value={typeChart} onChange={controlType}>
        <option disabled>Tipo de Gráficos</option>
        {chartOptions.graficos.map((grafic, index) => (
          <option key={index} value={grafic.type}>
            {grafic.type}
          </option>
        ))}
      </select>
      <div className="bg-auto">
          <h2 className="stat-value">Ingresos</h2>
          <AgCharts options={chartOptions} />
          <h2 className="stat-value text-secondary">Gastos</h2>
          <AgCharts options={chartOptions} />
      </div>
    </div>
  );
};
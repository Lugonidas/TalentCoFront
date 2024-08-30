import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  ArcElement,
  DoughnutController,
  PieController,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  PieController,
  ArcElement,
  DoughnutController
);

// Función para generar un color aleatorio
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

// Función para generar un color de borde aleatorio
const getRandomBorderColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

// Componente DynamicChart flexible para diferentes tipos de gráficos
export default function DynamicChart({
  labels,
  data,
  title,
  borderWidth,
  chartType,
}) {
  // Generar colores aleatorios para cada dato
  const backgroundColors = data.map(() => getRandomColor());
  const borderColors = data.map(() => getRandomBorderColor());

  // Preparar los datos para el gráfico
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: borderWidth || 0,
        barThickness:
          chartType === "bar" ? (borderWidth ? borderWidth : null) : undefined,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  // Determinar el tipo de gráfico a renderizar
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "line":
        return <Line data={chartData} options={options} />;
      case "doughnut":
        return <Doughnut data={chartData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />; // Valor predeterminado
    }
  };

  return renderChart();
}

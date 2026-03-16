import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MockResultChart({ chapter }) {

  const tests = chapter?.mockTests || [];

  if (tests.length === 0) {
    return <p>No mock tests yet</p>;
  }

  const labels = tests.map((_, i) => `Test ${i + 1}`);

  const percentages = tests.map(
    t => Math.round((t.score / t.total) * 100)
  );

  const avg =
    percentages.reduce((a, b) => a + b, 0) / percentages.length;

  const averageLine = new Array(percentages.length).fill(avg);

  const data = {
    labels,
    datasets: [
      {
        label: "Score %",
        data: percentages,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.15)",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#4f46e5",
        fill: true
      },
      {
        label: "Average",
        data: averageLine,
        borderColor: "#f59e0b",
        borderDash: [6,6],
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {

      legend: {
        position: "top"
      },

      title: {
        display: true,
        text: "Mock Test Performance Trend"
      },

      tooltip: {
        callbacks: {
          label: function(context){
            return `${context.raw}%`
          }
        }
      }

    },

    scales: {

      y: {
        beginAtZero: true,
        max: 100,

        ticks: {
          callback: value => value + "%"
        }

      }

    }

  };

  return (
    <div className="analytics-card">
      <Line data={data} options={options}/>
    </div>
  );

}
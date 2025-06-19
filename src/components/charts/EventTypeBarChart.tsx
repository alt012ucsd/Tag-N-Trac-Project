"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ChartProps {
  labels: string[];
  counts: number[];
}

export default function EventTypeBarChart({ labels, counts }: ChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Event Types",
        data: counts,
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#F44336"],
      },
    ],
  };

  return <Bar data={data} />;
}

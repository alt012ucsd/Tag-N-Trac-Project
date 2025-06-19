"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
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

export default function ProjectOrgChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("device_project_org_counts")
        .select("*");
      setLabels(
        data?.map((row) => `${row.project_name} (${row.organization})`) ?? []
      );
      setCounts(data?.map((row) => row.count) ?? []);
    }
    fetchData();
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Project + Org Counts",
        data: counts,
        backgroundColor: "#FF9800",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Projects by Organization</h3>
      <Bar data={chartData} />
    </div>
  );
}

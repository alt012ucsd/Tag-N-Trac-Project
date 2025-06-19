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

// Define color palette
const colorMap: Record<string, string> = {
  DEVICE_CONFIG_UPDATE_INITIATE: "#4CAF50", // Green
  DEVICE_CONFIG_UPDATE_SUCCESS: "#2196F3", // Blue
  DEVICE_CONFIG_UPDATE_FAIL: "#F44336", // Red (for future expansion)
};

export default function OrgEventChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("device_org_event_counts")
        .select("*");

      const organizations = [
        ...new Set(data?.map((row) => row.organization) ?? []),
      ];
      const eventTypes = [...new Set(data?.map((row) => row.event_type) ?? [])];

      const datasets = eventTypes.map((eventType) => ({
        label: eventType,
        data: organizations.map((org) => {
          const row = data?.find(
            (r) => r.organization === org && r.event_type === eventType
          );
          return row ? row.count : 0;
        }),
        backgroundColor: colorMap[eventType] ?? "#888888", // fallback grey for unknown events
      }));

      setChartData({ labels: organizations, datasets });
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">
        Organization by Event Types
      </h3>
      {chartData ? <Bar data={chartData} /> : <p>Loading...</p>}
    </div>
  );
}

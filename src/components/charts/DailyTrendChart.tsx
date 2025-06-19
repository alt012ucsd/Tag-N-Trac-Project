"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { getColorForOrganization } from "@/utils/generateColor";

ChartJS.register(
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  TimeScale
);

export default function DailyTrendChart() {
  const [labels, setLabels] = useState<
    { x: number; y: number; organization: string }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("device_daily_trends")
        .select("*");

      if (data) {
        const parsedData = data.map((row) => ({
          x: new Date(row.day).getTime(),
          y: Number(row.count),
          organization: row.organization,
        }));
        setLabels(parsedData);
      }
    }
    fetchData();
  }, []);

  const uniqueOrgs = [...new Set(labels.map((d) => d.organization))];

  const datasets = uniqueOrgs.map((org) => ({
    label: org,
    data: labels
      .filter((point) => point.organization === org)
      .map((point) => ({ x: point.x, y: point.y })),
    backgroundColor: getColorForOrganization(org),
    pointRadius: 6,
  }));

  const chartData = { datasets };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Devices Deployed</h3>
      <Scatter
        data={chartData}
        options={{
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "MMM dd, yyyy",
              },
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Device Count",
              },
            },
          },
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar"; // Adjust relative path as needed

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { createClient } from "@supabase/supabase-js";

ChartJS.register(ArcElement, Tooltip, Legend);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface DeviceConfig {
  device_type?: string | null;
  asset_type?: string | null;
  organization?: string | null;
  event_type?: string | null;
  config_start_button_needed?: boolean | null;
  config_use_rtd?: boolean | null;
  [key: string]: any;
}

function countByCategory<T extends Record<string, any>>(
  data: T[],
  field: keyof T
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of data) {
    const key = (item[field] ?? "Unknown") as string;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function countBoolean<T extends Record<string, any>>(
  data: T[],
  field: keyof T
): { true: number; false: number } {
  let trueCount = 0;
  let falseCount = 0;
  for (const item of data) {
    if (item[field] === true) trueCount++;
    else if (item[field] === false) falseCount++;
  }
  return { true: trueCount, false: falseCount };
}

export default function PieChartsPage() {
  const [data, setData] = useState<DeviceConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("device_configs")
        .select("*")
        .limit(500);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setData((data as DeviceConfig[]) ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error)
    return <p className="text-center mt-12 text-red-500">Error: {error}</p>;

  const pieDataForField = (field: keyof DeviceConfig) => {
    let counts: Record<string, number> | { true: number; false: number } = {};
    if (field === "config_start_button_needed" || field === "config_use_rtd") {
      counts = countBoolean(data, field);
    } else {
      counts = countByCategory(data, field);
    }
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#C9CBCF",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverBackgroundColor: backgroundColors.slice(0, labels.length),
        },
      ],
    };
  };

  return (
    <>
      <Navbar />
      <div className="font-sans bg-gray-50 min-h-screen p-10 text-gray-800">
        <h1 className="text-center mb-10 font-bold text-2xl">
          Analytics Pie Charts
        </h1>
        <div className="flex flex-wrap gap-10 justify-center">
          {[
            { field: "device_type", title: "Device Type" },
            { field: "asset_type", title: "Asset Type" },
            { field: "organization", title: "Organization" },
            { field: "event_type", title: "Event Type (Initiate/Success)" },
          ].map(({ field, title }) => (
            <div key={field} className="bg-white p-5 rounded-xl shadow-md w-80">
              <h3 className="text-center mb-5 font-semibold text-lg">{title}</h3>
              <Pie data={pieDataForField(field as keyof DeviceConfig)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

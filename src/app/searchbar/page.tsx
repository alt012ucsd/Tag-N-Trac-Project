"use client";

import { useState, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for your data
type ChartDataResponse = {
  labels: string[];
  values: number[];
  // Add other properties you expect from the API
};

type PieChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

export default function Dashboard() {
  const [project, setProject] = useState('');
  const [assetId, setAssetId] = useState('');
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
  if (!project && !assetId) return;

  try {
    setLoading(true);
    setError(null);

    const res = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project, asset_id: assetId }),
    });

    if (!res.ok) throw new Error('Failed to fetch data');

    const data: ChartDataResponse = await res.json();
    setChartData(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
    console.error('Fetch error:', err);
  } finally {
    setLoading(false);
  }
}, [project, assetId]);


  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [project, assetId, fetchData]);

  // Convert API data to chart format
  const pieChartData: PieChartData | null = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          // Add more colors as needed
        ],
      },
    ],
  } : null;

  return (
    <div className="dashboard-container">
      <div className="search-filters">
        <input
          placeholder="Project Name"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="search-input"
        />
        <input
          placeholder="Asset ID"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {pieChartData && (
        <div className="chart-container">
          <Pie data={pieChartData} />
        </div>
      )}
    </div>
  );
}
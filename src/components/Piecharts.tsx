import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(ArcElement, Tooltip, Legend);

const supabaseUrl = 'https://dqkguyiyfdhnohsvevtv.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa2d1eWl5ZmRobm9oc3ZldnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI2OTI4OSwiZXhwIjoyMDY1ODQ1Mjg5fQ.oDEZVguMLnIPxMhowK4356LApNQgMNYHgwB142v5EA4';
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

function countByCategory<T extends Record<string, any>>(data: T[], field: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of data) {
    const key = (item[field] ?? 'Unknown') as string;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function countBoolean<T extends Record<string, any>>(data: T[], field: keyof T): { true: number; false: number } {
  let trueCount = 0;
  let falseCount = 0;
  for (const item of data) {
    if (item[field] === true) trueCount++;
    else if (item[field] === false) falseCount++;
  }
  return { true: trueCount, false: falseCount };
}

export default function Analytics() {
  const [data, setData] = useState<DeviceConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('device_configs').select('*').limit(500);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setData(data as DeviceConfig[] ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Error: {error}</p>;

  const pieDataForField = (field: keyof DeviceConfig, title: string) => {
    let counts: Record<string, number> | { true: number; false: number } = {};
    if (field === 'config_start_button_needed' || field === 'config_use_rtd') {
      counts = countBoolean(data, field);
    } else {
      counts = countByCategory(data, field);
    }
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const backgroundColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#C9CBCF',
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
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
        padding: '40px 20px',
        color: '#333',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 40, fontWeight: '700' }}>Analytics Pie Charts</h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 40,
          justifyContent: 'center',
        }}
      >
        {[
          { field: 'device_type', title: 'Device Type' },
          { field: 'asset_type', title: 'Asset Type' },
          { field: 'organization', title: 'Organization' },
          { field: 'event_type', title: 'Event Type (Initiate/Success)' }
        ].map(({ field, title }) => (
          <div
            key={field}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: 320,
              width: '100%',
            }}
          >
            <h3
              style={{
                textAlign: 'center',
                marginBottom: 20,
                fontWeight: '600',
                color: '#555',
              }}
            >
              {title}
            </h3>
            <Pie data={pieDataForField(field as keyof DeviceConfig, title)} />
          </div>
        ))}
      </div>
    </div>
  );
}

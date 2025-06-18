import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(ArcElement, Tooltip, Legend);

const supabaseUrl = 'https://dqkguyiyfdhnohsvevtv.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa2d1eWl5ZmRobm9oc3ZldnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI2OTI4OSwiZXhwIjoyMDY1ODQ1Mjg5fQ.oDEZVguMLnIPxMhowK4356LApNQgMNYHgwB142v5EA4';
const supabase = createClient(supabaseUrl, supabaseKey);

function countByCategory(data, field) {
  const counts = {};
  for (const item of data) {
    const key = item[field] ?? 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function countBoolean(data, field) {
  let trueCount = 0;
  let falseCount = 0;
  for (const item of data) {
    if (item[field] === true) trueCount++;
    else if (item[field] === false) falseCount++;
  }
  return { true: trueCount, false: falseCount };
}

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('device_configs')
        .select('*')
        .limit(500);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Pick a few fields to show pie charts for categorical or boolean data:
  // device_type (string)
  // asset_type (string)
  // organization (string)
  // config_start_button_needed (boolean)
  // config_use_rtd (boolean)

  const pieDataForField = (field, title) => {
    let counts = {};
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
    <div style={{ padding: 20 }}>
      <h1>Analytics Pie Charts</h1>

      <div style={{ maxWidth: 600, marginBottom: 50 }}>
        <h3>Device Type</h3>
        <Pie data={pieDataForField('device_type', 'Device Type')} />
      </div>

      <div style={{ maxWidth: 600, marginBottom: 50 }}>
        <h3>Asset Type</h3>
        <Pie data={pieDataForField('asset_type', 'Asset Type')} />
      </div>

      <div style={{ maxWidth: 600, marginBottom: 50 }}>
        <h3>Organization</h3>
        <Pie data={pieDataForField('organization', 'Organization')} />
      </div>

      <div style={{ maxWidth: 600, marginBottom: 50 }}>
        <h3>Event Type (Initiate/Success)</h3>
        <Pie data={pieDataForField('event_type', 'Event Type')} />
      </div>

      <div style={{ maxWidth: 600, marginBottom: 50 }}>
        <h3>Project Name</h3>
        <Pie data={pieDataForField('project_name', 'Use RTD')} />
      </div>
    </div>
  );
}

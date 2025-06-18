import { useEffect, useState } from 'react';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/store-data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Webhook Data</h1>
      {data ? (
        <pre className="bg-gray-100 p-4 mt-2 rounded">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

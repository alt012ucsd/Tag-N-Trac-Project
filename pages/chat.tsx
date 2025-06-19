// components/AnalyticsAssistant.tsx
import { useState } from 'react';

export default function AnalyticsAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const askAI = async () => {
    const res = await fetch('/api/ask-ai', {
      method: 'POST',
      body: JSON.stringify({ question: input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setResponse(data.answer);
    setInput('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Ask AI About Analytics</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="E.g. How many shipments were delayed this week?"
      />
      <button onClick={askAI} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Ask
      </button>
      {response && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <strong>AI Response:</strong> {response}
        </div>
      )}
    </div>
  );
}

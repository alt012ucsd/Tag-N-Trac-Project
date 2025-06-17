"use-client";
import React from "react";

interface ActivityLogProps {
  logs: string[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Tracker Activity</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;

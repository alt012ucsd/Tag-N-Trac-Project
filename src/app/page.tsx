"use client";

import React from "react";
import StatCard from "@/components/StatCard";
import ActivityLog from "@/components/ActivityLog";

export default function Dashboard() {
  const logs = [
    "📍 Device #12 reported new location 5 mins ago",
    "⚠️ Device #7 disconnected",
    "✅ Device #9 reconnected",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        TrackerHub Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Active Trackers" value={52} />
        <StatCard title="Alerts Today" value={4} color="text-red-500" />
        <StatCard title="Devices Offline" value={2} color="text-yellow-500" />
      </div>

      <ActivityLog logs={logs} />
    </div>
  );
}

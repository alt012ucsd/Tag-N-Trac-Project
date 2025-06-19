"use-client";
import React from "react";

interface MockTrackerCardProps {
  tracker_id: string;
  location: string;
  timestamp: string;
  rssi: number;
  battery: number;
  ai_summary: string;
  temperature: number;
  humidity: number;
  motion_detected: boolean;
  last_seen: string;
}

const MockTrackerCard: React.FC<MockTrackerCardProps> = ({
  tracker_id,
  location,
  timestamp,
  rssi,
  battery,
  ai_summary,
  temperature,
  humidity,
  motion_detected,
  last_seen,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold">
        {tracker_id} - {location}
      </h2>
      <p className="text-sm text-gray-500">{timestamp}</p>
      <p>Battery: {battery}%</p>
      <p>Signal: {rssi} dBm</p>
      <p>Temp: {temperature} °C</p>
      <p>Humidity: {humidity}%</p>
      <p>Motion: {motion_detected ? "Detected" : "None"}</p>
      <p>Last Seen: {last_seen}</p>
      <p className="mt-2 text-sm text-gray-700">{ai_summary}</p>
    </div>
  );
};

export default MockTrackerCard;

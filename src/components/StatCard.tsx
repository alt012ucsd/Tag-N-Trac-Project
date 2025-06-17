import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;

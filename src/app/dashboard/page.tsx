"use client";

import Navbar from "../../components/navbar";

import DailyTrendChart from "@/components/charts/DailyTrendChart";
import OrgEventChart from "@/components/charts/OrgEventChart";
import ProjectOrgChart from "@/components/charts/ProjectOrgChart";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Live TrackerHub Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DailyTrendChart />
          <OrgEventChart />
          <ProjectOrgChart />
        </div>
      </div>
    </>
  );
}

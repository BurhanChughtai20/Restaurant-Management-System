"use client";

import React from "react";
import { CardsStats } from "./chartComponent";
import DynamicContent from "../Title";

/**
 * DRY Principle: Define a common interface for your chart data 
 * so it stays consistent across different routes.
 */
const DUMMY_CHART_DATA = [
  { month: "Jan", revenue: 12000, subscription: 150 },
  { month: "Feb", revenue: 15000, subscription: 230 },
  { month: "Mar", revenue: 9000, subscription: 180 },
  { month: "Apr", revenue: 21000, subscription: 400 },
  { month: "May", revenue: 18000, subscription: 350 },
  { month: "Jun", revenue: 24000, subscription: 520 },
];

const DashboardClient = () => {
  // --- Future RTK Query integration placeholder ---
  // const { data: apiResponse, isLoading, isError } = useGetDashboardStatsQuery();
  
  // For now, we simulate a successful API load
  const isLoading = false;
  const isError = false;
  const apiResponse = { chartData: DUMMY_CHART_DATA };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading Analytics...</div>;
  if (isError || !apiResponse) return <div className="p-6 text-destructive">Failed to load data.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <DynamicContent as="h2" className="text-3xl font-bold tracking-tight">Dashboard Overview</DynamicContent>
        <DynamicContent as="p" className="text-muted-foreground">
          Real-time performance metrics across all channels.
        </DynamicContent>
      </div>

      <hr className="border-border/40" />
      
      {/* Type-Safety: CardsStats receives the dummy data. 
        When you switch to RTK-Q, you just swap apiResponse.chartData here.
      */}
      <CardsStats data={apiResponse.chartData} />
      
    </div>
  );
};

export default DashboardClient;
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicDashboardCards, DashboardCard } from "./chartComponent";
import DynamicContent from "../Title";
import { ChartConfig } from "@/components/ui/chart";
import { DataTable } from "./table/data-table";
import { Orders } from "./types";
import { ordersColumns } from "./tables/orders-columns.ts";
/* -------------------------------------------------------------------------- */
/*                               Chart Configs                                 */
/* -------------------------------------------------------------------------- */

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  subscription: { label: "Subscriptions", color: "hsl(var(--chart-2))" },
};

const usersConfig: ChartConfig = {
  newUsers: { label: "New Users", color: "hsl(var(--chart-3))" },
  activeUsers: { label: "Active Users", color: "hsl(var(--chart-4))" },
};

const ordersConfig: ChartConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-5))" },
  pending: { label: "Pending", color: "hsl(var(--chart-1))" },
};

const trafficConfig: ChartConfig = {
  organic: { label: "Organic", color: "hsl(var(--chart-2))" },
  paid: { label: "Paid", color: "hsl(var(--chart-3))" },
};

/* -------------------------------------------------------------------------- */
/*                            Static Dummy Data                                */
/* -------------------------------------------------------------------------- */

const STATIC_CARDS: DashboardCard[] = [
  {
    id: "revenue",
    title: "Revenue & Subscriptions",
    description: "Monthly performance overview",
    trendPercentage: 5.2,
    trendDirection: "up",
    dateRange: "Jan – Jun 2024",
    chartConfig: revenueConfig,
    dataKey1: "revenue",
    dataKey2: "subscription",
    data: [
      { month: "Jan", revenue: 12000, subscription: 150 },
      { month: "Feb", revenue: 15000, subscription: 230 },
      { month: "Mar", revenue: 9000, subscription: 180 },
      { month: "Apr", revenue: 21000, subscription: 400 },
      { month: "May", revenue: 18000, subscription: 350 },
      { month: "Jun", revenue: 24000, subscription: 520 },
    ],
  },
  {
    id: "users",
    title: "User Growth",
    description: "New vs Active users",
    trendPercentage: 12.5,
    trendDirection: "up",
    dateRange: "Jan – Jun 2024",
    chartConfig: usersConfig,
    dataKey1: "newUsers",
    dataKey2: "activeUsers",
    data: [
      { month: "Jan", newUsers: 450, activeUsers: 1200 },
      { month: "Feb", newUsers: 520, activeUsers: 1450 },
      { month: "Mar", newUsers: 380, activeUsers: 1350 },
      { month: "Apr", newUsers: 680, activeUsers: 1800 },
      { month: "May", newUsers: 590, activeUsers: 1650 },
      { month: "Jun", newUsers: 720, activeUsers: 2100 },
    ],
  },
  {
    id: "orders",
    title: "Order Status",
    description: "Completed vs Pending",
    trendPercentage: 3.1,
    trendDirection: "down",
    dateRange: "Jan – Jun 2024",
    chartConfig: ordersConfig,
    dataKey1: "completed",
    dataKey2: "pending",
    data: [
      { month: "Jan", completed: 340, pending: 45 },
      { month: "Feb", completed: 410, pending: 32 },
      { month: "Mar", completed: 280, pending: 58 },
      { month: "Apr", completed: 520, pending: 41 },
      { month: "May", completed: 450, pending: 67 },
      { month: "Jun", completed: 590, pending: 52 },
    ],
  },
  {
    id: "traffic",
    title: "Traffic Sources",
    description: "Organic vs Paid",
    trendPercentage: 8.7,
    trendDirection: "up",
    dateRange: "Jan – Jun 2024",
    chartConfig: trafficConfig,
    dataKey1: "organic",
    dataKey2: "paid",
    data: [
      { month: "Jan", organic: 5400, paid: 2100 },
      { month: "Feb", organic: 6200, paid: 2400 },
      { month: "Mar", organic: 4800, paid: 1900 },
      { month: "Apr", organic: 7100, paid: 2800 },
      { month: "May", organic: 6500, paid: 2600 },
      { month: "Jun", organic: 8200, paid: 3200 },
    ],
  },
];

const STATIC_TABLE_DATA: Orders[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
];

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

const DashboardClient: React.FC = () => {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [tableData, setTableData] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // TEMP: Static data
      await new Promise((res) => setTimeout(res, 300));

      setCards(STATIC_CARDS);
      setTableData(STATIC_TABLE_DATA);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const memoizedCards = useMemo(() => cards, [cards]);
  const memoizedTableData = useMemo(() => tableData, [tableData]);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading Analytics...</div>;
  }

  if (isError) {
    return <div className="p-6 text-destructive">Failed to load data.</div>;
  }
  const DASHBOARD_HEADER_CONTENT = [
  {
    as: "h2" as const,
    className: "text-2xl sm:text-3xl font-bold",
    content: "Dashboard Overview",
  },
  {
    as: "p" as const,
    className: "text-muted-foreground",
    content: "Real-time performance metrics across all channels.",
  },
];


  return (
    <div className="flex flex-col h-full  md:p-3">
      <div className="flex-1 space-y-2 p-4 md:p-3 pt-6">
        <div className="flex flex-col gap-2">
  {DASHBOARD_HEADER_CONTENT.map(({ as, className, content }, index) => (
    <DynamicContent
      key={index}
      as={as}
      className={className}
    >
      {content}
    </DynamicContent>
  ))}
</div>


        <hr className="border-border/40" />

        <DynamicDashboardCards cards={memoizedCards} maxCards={4} />
      </div>

      <div className="container mx-auto p-3 flex flex-col ">
        <DataTable columns={ordersColumns} data={memoizedTableData} />
      </div>
    </div>
  );
};

export default DashboardClient;

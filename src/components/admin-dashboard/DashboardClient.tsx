"use client";
import React, { useMemo } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { DollarSign, ShoppingCart, Users, TrendingUp, Eye, MessageCircle } from "lucide-react";
import { DynamicGrid, DynamicCard, DynamicTable } from "@/components/shared";
import { useGetAllOrdersQuery } from "@/app/store/api";

const DashboardClient: React.FC = () => {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: 1200, // example static data
      profit: 4500,          // example static data
      visits: 5600,          // example static data
      feedback: 230,         // example static data
    };
  }, [orders]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare dynamic cards
  const cards = [
    {
      id: 1,
      content: (
        <DynamicCard
          title="Revenue"
          value={`$${metrics.totalRevenue.toFixed(2)}`}
          subtitle="This Month"
          icon={<DollarSign />}
          trend={{ value: 12, isPositive: true }}
        />
      ),
    },
    {
      id: 2,
      content: (
        <DynamicCard
          title="Orders"
          value={metrics.totalOrders}
          subtitle="Pending"
          icon={<ShoppingCart />}
          trend={{ value: -5 }}
        />
      ),
    },
    {
      id: 3,
      content: (
        <DynamicCard
          title="Customers"
          value={metrics.totalCustomers}
          subtitle="New"
          icon={<Users />}
        />
      ),
    },
    {
      id: 4,
      content: (
        <DynamicCard
          title="Profit"
          value={`$${metrics.profit.toLocaleString()}`}
          subtitle="This Month"
          icon={<TrendingUp />}
          trend={{ value: 8, isPositive: true }}
        />
      ),
    },
    {
      id: 5,
      content: (
        <DynamicCard
          title="Visits"
          value={metrics.visits}
          subtitle="This Week"
          icon={<Eye />}
          trend={{ value: 3 }}
        />
      ),
    },
    {
      id: 6,
      content: (
        <DynamicCard
          title="Feedback"
          value={metrics.feedback}
          subtitle="Pending"
          icon={<MessageCircle />}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ wordBreak: "break-word", mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Responsive Metric Cards */}
      <Box sx={{ mb: 4 }}>
        <DynamicGrid items={cards} spacing={3} />
      </Box>

      {/* Recent Orders Table */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Orders
        </Typography>
        <DynamicTable
          data={orders.slice(0, 5) as unknown as Record<string, unknown>[]}
          columns={[]} // optionally define your columns
          rowKey="id"
        />
      </Paper>
    </Box>
  );
};

export default DashboardClient;

"use client";
import React, { useMemo } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { DollarSign } from "lucide-react";
import { DynamicGrid, DynamicCard, DynamicTable } from "@/components/shared";
import { useGetAllOrdersQuery } from "@/app/store/api";

const DashboardClient: React.FC = () => {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return {
      totalRevenue,
      totalOrders: orders.length,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Box sx={{ mb: 3 }}>
        <DynamicGrid
          items={[
            {
              id: "rev",
              xs: 12,
              md: 3,
              content: (
                <DynamicCard
                  title="Total Revenue"
                  value={`$${metrics.totalRevenue.toFixed(2)}`}
                  icon={<DollarSign />}
                />
              ),
            },
          ]}
          spacing={2}
        />
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Orders
        </Typography>
        <DynamicTable
          data={orders.slice(0, 5) as unknown as Record<string, unknown>[]}
          columns={[]}
          rowKey="id"
        />
      </Paper>
    </Box>
  );
};

export default DashboardClient;

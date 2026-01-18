"use client";

import React from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";

export interface GridItem {
  id: string | number;
  content: React.ReactNode;
}

interface DynamicGridProps {
  items: GridItem[];
  loading?: boolean;
  error?: string;
  spacing?: number;
}

export const DynamicGrid: React.FC<DynamicGridProps> = ({
  items,
  loading = false,
  error,
  spacing = 3,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box
        minHeight={300}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Typography color="text.secondary">No items to display</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={spacing}>
      {items.map((item) => (
        // @ts-expect-error - MUI Grid item prop typing issue in v5
        <Grid
          item={true}
          key={item.id}
           xs={6} // 2 cards per row on mobile
          sm={6} // 2 cards per row on small
          md={6} // 2 cards per row on medium
          lg={3} // 4 cards per row on large
          xl={3} // 4 cards per row on extra-large
        >
          {item.content}
        </Grid>
      ))}
    </Grid>
  );
};

export default DynamicGrid;

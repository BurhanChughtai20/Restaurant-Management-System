"use client";

import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DynamicCard, { StatsCardProps } from "../shared/DynamicCard";
import CustomizedDataGrid from "./CustomizedDataGrid";
import CustomizedTreeView from "./CustomizedTreeView";
import { MainGridConfig, StatCardData } from "./types";

export default function MainGrid({
  overviewTitle,
  detailsTitle,
  statCards = [],
  highlightedCard,
  dataGrid = { rows: [], columns: [] },
  treeView = { items: [], title: "" },
}: MainGridConfig) {
  // -------------------- Memoized function to map stat card data --------------------
  const mapStatCardDataToProps = useCallback((card: StatCardData): StatsCardProps => {
    const maxValue = card.data.length ? Math.max(...card.data) : 0;
    let isPositive: boolean | undefined;

    switch (card.trend) {
      case "up":
        isPositive = true;
        break;
      case "down":
        isPositive = false;
        break;
      case "neutral":
      default:
        isPositive = undefined;
    }

    return {
      title: card.title,
      value: card.value,
      subtitle: card.interval,
      trend: { value: maxValue, isPositive, label: card.trend },
      progress: card.data.length
        ? { value: card.data[card.data.length - 1], max: maxValue }
        : undefined,
    };
  }, []);

  return (
    <Box maxWidth={1700} width="100%" mx="auto" px={2}>
      {/* Overview Title */}
      <Typography variant="h6" mb={2}>{overviewTitle}</Typography>

      {/* Stats Cards Grid */}
      <Box
        display="grid"
        gap={2}
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          width: "100%",
          alignItems: "stretch",
          justifyContent: "stretch",
        }}
      >
        {statCards.map(card => (
          <Box key={card.title} sx={{ height: "100%" }}>
            <DynamicCard {...mapStatCardDataToProps(card)} />
          </Box>
        ))}

        {highlightedCard && (
          <Box sx={{ height: "100%" }}>
            <DynamicCard
              title={highlightedCard.title}
              value={highlightedCard.description}
              subtitle={highlightedCard.buttonText}
              onClick={highlightedCard.onClick}
            />
          </Box>
        )}
      </Box>

      {/* Details Section */}
      {detailsTitle && (dataGrid.rows.length || treeView.items.length) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>{detailsTitle}</Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {dataGrid.rows.length > 0 && (
              <Box sx={{ flex: "1 1 70%", minWidth: 300 }}>
                <CustomizedDataGrid {...dataGrid} />
              </Box>
            )}
            {treeView.items.length > 0 && (
              <Box sx={{ flex: "1 1 30%", minWidth: 200 }}>
                <CustomizedTreeView {...treeView} />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
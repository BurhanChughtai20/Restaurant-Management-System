"use client";

import React from "react";
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
  // Mapper function to convert StatCardData to DynamicCard props
  const mapStatCardDataToProps = (card: StatCardData): StatsCardProps => {
    let trendValue = 0;
    let isPositive: boolean | undefined;

    switch (card.trend) {
      case "up":
        trendValue = Math.max(...card.data);
        isPositive = true;
        break;
      case "down":
        trendValue = Math.max(...card.data);
        isPositive = false;
        break;
      case "neutral":
        trendValue = 0;
        isPositive = undefined;
        break;
    }

    return {
      title: card.title,
      value: card.value,
      subtitle: card.interval,
      trend: { value: trendValue, isPositive, label: card.trend },
      progress: card.data.length
        ? {
            value: card.data[card.data.length - 1],
            max: Math.max(...card.data),
          }
        : undefined,
    };
  };

  return (
    <Box maxWidth={1700} width="100%" mx="auto" px={2}>
      {/* Overview Section */}
      <Typography variant="h6" mb={2}>
        {overviewTitle}
      </Typography>
      {/* Cards Section */}
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
          // This ensures all grid items are forced to the height of the tallest item
          alignItems: "stretch",
          // This ensures all grid items have the exact same width (25% minus gap)
          justifyContent: "stretch",
        }}
      >
        {statCards.map((card: StatCardData) => (
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
      {detailsTitle && (dataGrid || treeView) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            {detailsTitle}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2}>
            {dataGrid && (
              <Box sx={{ flex: "1 1 70%", minWidth: 300 }}>
                <CustomizedDataGrid {...dataGrid} />
              </Box>
            )}

            {treeView && (
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

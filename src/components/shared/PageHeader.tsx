import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface PageAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: PageAction[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions = [],
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        flexWrap: "nowrap",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      {actions.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,
            gap: 1,
            ml: 2,
            overflowX: "auto",
          }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
              startIcon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              sx={{
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

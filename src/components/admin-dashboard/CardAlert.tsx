"use client";

import React, { useCallback, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Sparkles } from "lucide-react";
import ButtonCom from "@/components/Button";
import type { CardAlertConfig } from "./types";

const ICON_SIZE = 16;
const CARD_MARGIN = 1.5;
const TYPOGRAPHY_MARGIN_BOTTOM = 2;
const DEFAULT_TITLE = "Plan about to expire";
const DEFAULT_DESCRIPTION = "Enjoy 10% off when renewing your plan today.";
const DEFAULT_BUTTON_TEXT = "Get the discount";

// Memoized styles using useMemo for performance
const useCardStyles = () =>
  useMemo(
    () => ({
      margin: CARD_MARGIN,
      flexShrink: 0,
    }),
    []
  );

const useTitleStyles = () =>
  useMemo(
    () => ({
      fontWeight: 600,
    }),
    []
  );

const useDescriptionStyles = () =>
  useMemo(
    () => ({
      marginBottom: TYPOGRAPHY_MARGIN_BOTTOM,
      color: "text.secondary",
    }),
    []
  );

// Single alert card component
const CardAlert: React.FC<CardAlertConfig> = React.memo(
  ({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, buttonText = DEFAULT_BUTTON_TEXT, onButtonClick }) => {
    const cardStyles = useCardStyles();
    const titleStyles = useTitleStyles();
    const descriptionStyles = useDescriptionStyles();

    // Memoized button click handler
    const handleClick = useCallback(() => {
      if (onButtonClick) onButtonClick();
    }, [onButtonClick]);

    return (
      <Card variant="outlined" sx={cardStyles}>
        <CardContent>
          <Sparkles size={ICON_SIZE} className="mb-2" />
          <Typography gutterBottom sx={titleStyles}>
            {title}
          </Typography>
          <Typography variant="body2" sx={descriptionStyles}>
            {description}
          </Typography>
          <ButtonCom text={buttonText} type="primary" onClick={handleClick} className="w-full" />
        </CardContent>
      </Card>
    );
  }
);

CardAlert.displayName = "CardAlert";

// Optional: Component to render multiple alerts recursively (if you have nested alerts)
export const CardAlertList: React.FC<{ alerts: CardAlertConfig[] }> = ({ alerts }) => {
  // Recursive render (normal function, not useCallback)
  function renderAlerts(alertsArray: CardAlertConfig[]): React.ReactNode {
    if (!alertsArray || alertsArray.length === 0) return null;

    return alertsArray.map((alert, index) => (
      <React.Fragment key={index}>
        <CardAlert {...alert} />
        {/* Recursively render children if exist */}
        {"children" in alert && Array.isArray(alert.children) ? renderAlerts(alert.children) : null}
      </React.Fragment>
    ));
  }

  return <>{renderAlerts(alerts)}</>;
};


export default CardAlert;

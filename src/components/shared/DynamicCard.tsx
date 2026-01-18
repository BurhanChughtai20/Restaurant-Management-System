"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

/* ---------------- Tailwind Classes ---------------- */

const classes = {
  container: "inter-var !w-full !max-w-full py-0 h-full",
  clickableWrapper: "cursor-pointer w-full h-full",

  // Responsive padding & height
  cardBody:
    "relative group/card bg-white border border-black/10 rounded-xl p-4 sm:p-5 text-black w-full h-full flex flex-col justify-between overflow-hidden",

  header: "flex justify-between items-start mb-2",
  headerLeft: "flex-1 min-w-0",

  title: "text-xs uppercase tracking-widest font-semibold text-black/60 sm:text-sm truncate",
  value: "text-2xl font-extrabold mt-1 sm:text-3xl md:text-4xl truncate my-2",
  subtitle: "text-sm mt-0.5 text-black/60 sm:text-base line-clamp-1",

  iconWrapper:
    "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-black/10",

  trend:
    "flex items-center gap-1 mt-2 text-xs sm:text-sm",

  trendValue:
    "font-semibold",

  progressWrapper:
    "mt-3",

  progressHeader:
    "flex justify-between text-xs font-medium mb-1 sm:text-sm",

  progressTrack:
    "h-1.5 w-full rounded-full bg-black/10 overflow-hidden",

  progressBar:
    "h-full bg-black rounded-full",

  loadingWrapper:
    "absolute top-0 left-0 right-0 h-1 bg-black/10 overflow-hidden",

  loadingBar:
    "h-full w-1/3 animate-pulse bg-black",
};

/* ---------------- Types ---------------- */

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  onClick?: () => void;
  loading?: boolean;
}

/* ---------------- Component ---------------- */

const DynamicCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  onClick,
  loading = false,
}) => {
  const isPositive = trend
    ? trend.isPositive ?? trend.value > 0
    : false;

  const TrendIcon =
    trend?.value === 0
      ? Minus
      : isPositive
      ? TrendingUp
      : TrendingDown;

  return (
    <CardContainer className={classes.container}>
      <div
        onClick={onClick}
        className={onClick ? classes.clickableWrapper : undefined}
      >
        <CardBody className={classes.cardBody}>
          {/* Header */}
          <div className={classes.header}>
            <div className={classes.headerLeft}>
              <CardItem translateZ={20} className={classes.title}>
                {title}
              </CardItem>

              <CardItem translateZ={40} className={classes.value}>
                {value}
              </CardItem>

              {subtitle && (
                <CardItem translateZ={30} className={classes.subtitle}>
                  {subtitle}
                </CardItem>
              )}
            </div>

            {icon && (
              <CardItem translateZ={60} className={classes.iconWrapper}>
                {icon}
              </CardItem>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <CardItem translateZ={30} className={classes.trend}>
              <TrendIcon size={12} />
              <span className={classes.trendValue}>
                {Math.abs(trend.value)}%
              </span>
              {trend.label && <span>{trend.label}</span>}
            </CardItem>
          )}

          {/* Progress */}
          {progress && (
            <CardItem translateZ={40} className={classes.progressWrapper}>
              <div className={classes.progressHeader}>
                <span>{progress.label ?? "Progress"}</span>
                <span>
                  {progress.value}/{progress.max}
                </span>
              </div>

              <div className={classes.progressTrack}>
                <div
                  className={classes.progressBar}
                  style={{
                    width: `${(progress.value / progress.max) * 100}%`,
                  }}
                />
              </div>
            </CardItem>
          )}

          {/* Loading */}
          {loading && (
            <div className={classes.loadingWrapper}>
              <div className={classes.loadingBar} />
            </div>
          )}
        </CardBody>
      </div>
    </CardContainer>
  );
};

export default DynamicCard;

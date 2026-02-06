"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Interface for individual chart data
export interface DashboardChartItem {
  month: string
  [key: string]: string | number
}

// Interface for individual card configuration
export interface DashboardCard {
  id: string
  title: string
  description: string
  data: DashboardChartItem[]
  chartConfig: ChartConfig
  trendPercentage: number
  trendDirection: "up" | "down"
  dateRange: string
  dataKey1: string
  dataKey2: string
}

interface DynamicDashboardCardsProps {
  cards: DashboardCard[]
  maxCards?: number
}

export function DynamicDashboardCards({ 
  cards, 
  maxCards = 4 
}: DynamicDashboardCardsProps) {
  const displayCards = cards.slice(0, maxCards)

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {displayCards.map((card) => (
        <Card key={card.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">{card.title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {card.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pb-2">
            {/* Pass the stable card.id to ChartContainer */}
            <ChartContainer 
              id={card.id} 
              config={card.chartConfig} 
              className="h-30 sm:h-35 w-full"
            >
              <AreaChart
                data={card.data}
                margin={{ left: 0, right: 0, top: 5, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey={card.dataKey1}
                  type="natural"
                  fill={`var(--color-${card.dataKey1})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${card.dataKey1})`}
                  stackId="a"
                />
                <Area
                  dataKey={card.dataKey2}
                  type="natural"
                  fill={`var(--color-${card.dataKey2})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${card.dataKey2})`}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex w-full items-start gap-2 text-xs sm:text-sm">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending {card.trendDirection} by {Math.abs(card.trendPercentage)}%
                  {card.trendDirection === "up" ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none text-xs">
                  {card.dateRange}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
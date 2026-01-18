/**
 * Dynamic Grid Component
 * Reusable responsive grid layout
 * Follows SRP - handles only grid layout logic
 */

'use client';

import React from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';

export interface GridItem {
    id: string | number;
    content: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

interface DynamicGridProps {
    items: GridItem[];
    loading?: boolean;
    error?: string;
    spacing?: number;
    emptyStateMessage?: string;
    emptyStateIcon?: React.ReactNode;
}

const DynamicGrid: React.FC<DynamicGridProps> = ({
    items,
    loading = false,
    error,
    spacing = 3,
    emptyStateMessage = 'No items to display',
    emptyStateIcon,
}) => {
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                    p: 4,
                }}
            >
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                    p: 4,
                    gap: 2,
                }}
            >
                {emptyStateIcon && (
                    <Box sx={{ opacity: 0.3, mb: 1 }}>
                        {emptyStateIcon}
                    </Box>
                )}
                <Typography variant="body1" color="text.secondary">
                    {emptyStateMessage}
                </Typography>
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
                    xs={item.xs ?? 12}
                    sm={item.sm ?? 6}
                    md={item.md ?? 4}
                    lg={item.lg ?? 3}
                    xl={item.xl ?? 3}
                >
                    {item.content}
                </Grid>
            ))}
        </Grid>
    );
};

export default DynamicGrid;

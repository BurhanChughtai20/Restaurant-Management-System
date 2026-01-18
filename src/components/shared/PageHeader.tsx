
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// ============================================================================
// TYPES
// ============================================================================

interface PageAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    disabled?: boolean;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: PageAction[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const HEADER_STYLES = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
    },
    actionsContainer: {
        display: 'flex',
        gap: 2,
    },
    button: {
        borderRadius: 2,
    },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    actions = [],
}) => {
    return (
        <Box sx={HEADER_STYLES.container}>
            <Box>
                <Typography variant="h4" fontWeight={700}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {actions.length > 0 && (
                <Box sx={HEADER_STYLES.actionsContainer}>
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || 'contained'}
                            color={action.color || 'primary'}
                            startIcon={action.icon}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            sx={HEADER_STYLES.button}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
};

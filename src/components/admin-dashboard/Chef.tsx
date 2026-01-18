'use client';

import React from 'react';
import {
    Box,
    Button, 
    Typography,
    Chip,
    Avatar,
    Stack,
} from '@mui/material';
import { QrCode,  Trash2, ChefHat } from 'lucide-react';
import {
    DynamicTable,
    DynamicCard,
    DynamicGrid,
    Column,
    TableAction,
    GridItem,
} from '@/components/shared';
import {
    useGetAllChefsQuery,
    useGetChefStatsQuery,
    useGenerateChefTokenMutation,
    useDeleteChefConnectionMutation,
    Chef,
} from '@/app/store/api';

/* ============================================================================
   COMPONENT
============================================================================ */

const ChefsPage: React.FC = () => {
    const { data: chefs = [], isLoading } = useGetAllChefsQuery();
    const { data: stats } = useGetChefStatsQuery();

    const [generateToken] = useGenerateChefTokenMutation();
    const [deleteConnection] = useDeleteChefConnectionMutation();

    /* ============================================================================
       TABLE COLUMNS
    ============================================================================ */

    const columns: Column<Chef>[] = [
        {
            id: 'id',
            label: 'ID',
            minWidth: 70,
        },
        {
            id: 'name',
            label: 'Name',
            minWidth: 150,
            format: (value, row) => {
                if (typeof value !== 'string') return null;

                return (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32 }}>
                            <ChefHat size={18} />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {row.email}
                            </Typography>
                        </Box>
                    </Stack>
                );
            },
        },
        {
            id: 'isEmailVerified',
            label: 'Email Verified',
            align: 'center',
            format: (value) => {
                if (typeof value !== 'boolean') return null;

                return (
                    <Chip
                        label={value ? 'Verified' : 'Pending'}
                        color={value ? 'success' : 'warning'}
                        size="small"
                    />
                );
            },
        },
        {
            id: 'chefConnection',
            label: 'Connection',
            align: 'center',
            sortable: false,
            format: (value) => {
                if (
                    typeof value !== 'object' ||
                    value === null ||
                    !('isActive' in value)
                ) {
                    return '—';
                }

                const connection = value as Chef['chefConnection'];

                return (
                    <Chip
                        label={connection?.isActive ? 'Active' : 'Inactive'}
                        color={connection?.isActive ? 'success' : 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            id: 'chefConnection',
            label: 'Schedule',
            sortable: false,
            format: (value) => {
                if (
                    typeof value !== 'object' ||
                    value === null ||
                    !('fromTime' in value) ||
                    !('toTime' in value)
                ) {
                    return '—';
                }

                const connection = value as Chef['chefConnection'];

                if (!connection?.fromTime || !connection?.toTime) return '—';

                return (
                    <Typography variant="caption">
                        {connection.fromTime} – {connection.toTime}
                    </Typography>
                );
            },
        },
    ];

    /* ============================================================================
       TABLE ACTIONS
    ============================================================================ */

    const actions: TableAction<Chef>[] = [
        {
            icon: <Trash2 size={18} />,
            label: 'Remove Connection',
            show: (row) => Boolean(row.chefConnection),
            onClick: async (row) => {
                if (confirm(`Remove connection for ${row.name}?`)) {
                    await deleteConnection({ chefId: row.id });
                }
            },
        },
    ];

    /* ============================================================================
       STATS CARDS
    ============================================================================ */

    const statsCards: GridItem[] = [
        {
            id: 'total',
            xs: 12,
            sm: 6,
            md: 4,
            content: (
                <DynamicCard
                    title="Total Chefs"
                    value={stats?.total ?? 0}
                    subtitle="All kitchen staff"
                    icon={<ChefHat size={28} />}
                />
            ),
        },
        {
            id: 'active',
            xs: 12,
            sm: 6,
            md: 4,
            content: (
                <DynamicCard
                    title="Active"
                    value={stats?.active ?? 0}
                    subtitle="Currently working"
                />
            ),
        },
        {
            id: 'inactive',
            xs: 12,
            sm: 6,
            md: 4,
            content: (
                <DynamicCard
                    title="Inactive"
                    value={stats?.inactive ?? 0}
                    subtitle="Off duty"
                />
            ),
        },
    ];

    /* ============================================================================
       RENDER
    ============================================================================ */

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Chefs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<QrCode size={20} />}
                    onClick={async () => {
                        const result = await generateToken().unwrap();
                        // QR Code usage removed for now to prevent unused variable warning
                        alert('QR Token generated'); 
                    }}
                >
                    Generate QR Token
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <DynamicGrid items={statsCards} spacing={3} />
            </Box>

            <DynamicTable<Chef>
                columns={columns}
                data={chefs}
                actions={actions}
                loading={isLoading}
                rowKey="id"
            />
        </Box>
    );
};

export default ChefsPage;

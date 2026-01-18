'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import { QrCode, Clock, Trash2 } from 'lucide-react';
import {
  DynamicTable,
  DynamicCard,
  DynamicGrid,
  Column,
  TableAction,
  GridItem,
} from '@/components/shared';
import {
  useGetAllOrderTakersQuery,
  useGetOrderTakerStatsQuery,
  useGenerateOrderTakerTokenMutation,
  useUpdateOrderTakerConnectionMutation,
  useDeleteOrderTakerConnectionMutation,
  OrderTaker,
} from '@/app/store/api';
import ButtonCom from '../Button';

const OrderTakersPage: React.FC = () => {
  const { data: orderTakers = [], isLoading } = useGetAllOrderTakersQuery();
  const { data: stats } = useGetOrderTakerStatsQuery();

  const [generateToken] = useGenerateOrderTakerTokenMutation();
  const [updateConnection] = useUpdateOrderTakerConnectionMutation();
  const [deleteConnection] = useDeleteOrderTakerConnectionMutation();

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState<OrderTaker | null>(null);
  const [timeData, setTimeData] = useState({ fromTime: '', toTime: '' });

  const columns: Column<OrderTaker>[] = [
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
        if (!value || typeof value !== 'string') return null;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32 }}>{value.charAt(0).toUpperCase()}</Avatar>
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
        if (typeof value !== 'boolean') return '—';
        return <Chip label={value ? 'Verified' : 'Pending'} size="small" />;
      },
    },
    {
      id: 'waiterConnection',
      label: 'Connection',
      minWidth: 120,
      align: 'center',
      sortable: false,
      format: (value, row) => {
        const connection = row.waiterConnection;
        if (!connection) return '—';
        return <Chip label={connection.isActive ? 'Active' : 'Inactive'} size="small" />;
      },
    },
    {
      id: 'waiterConnection',
      label: 'Schedule',
      minWidth: 150,
      sortable: false,
      format: (value, row) => {
        const connection = row.waiterConnection;
        if (!connection?.fromTime || !connection?.toTime) return '—';
        return (
          <Typography variant="caption">
            {connection.fromTime} - {connection.toTime}
          </Typography>
        );
      },
    },
  ];

  const actions: TableAction<OrderTaker>[] = [
    {
      icon: <Clock size={18} />,
      label: 'Set Schedule',
      onClick: (row) => {
        setSelectedWaiter(row);
        setTimeData({
          fromTime: row.waiterConnection?.fromTime || '',
          toTime: row.waiterConnection?.toTime || '',
        });
        setScheduleDialogOpen(true);
      },
    },
    {
      icon: <Trash2 size={18} />,
      label: 'Remove Connection',
      onClick: async (row) => {
        if (confirm(`Remove connection for ${row.name}?`)) {
          await deleteConnection({ orderTakerId: row.id });
        }
      },
      show: (row) => !!row.waiterConnection,
    },
  ];

  const handleGenerateQR = async () => {
    try {
      const result = await generateToken().unwrap();
      setQrCode(result.qrCode);
      setQrDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!selectedWaiter) return;
    try {
      await updateConnection({
        orderTakerId: selectedWaiter.id,
        ...timeData,
      }).unwrap();
      setScheduleDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Stats Cards for DynamicGrid
  const statsCards: GridItem[] = [
    {
      id: 'total',
      content: (
        <DynamicCard
          title="Total Waiters"
          value={stats?.total ?? 0}
          subtitle="All staff members"
        />
      ),
    },
    {
      id: 'active',
      content: (
        <DynamicCard
          title="Active"
          value={stats?.active ?? 0}
          subtitle="Currently connected"
          trend={{ value: stats?.active ?? 0, isPositive: true }}
        />
      ),
    },
    {
      id: 'inactive',
      content: (
        <DynamicCard
          title="Inactive"
          value={stats?.inactive ?? 0}
          subtitle="Not connected"
          trend={{ value: stats?.inactive ?? 0, isPositive: false }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Order Takers
        </Typography>

        <ButtonCom
          text="Generate QR Token"
          icon={<QrCode size={20} />}
          iconPosition="left"
          type="default"
          gradient
          className="rounded-lg shadow-md mt-2 md:mt-0"
          onClick={handleGenerateQR}
        />
      </Box>

      {/* Stats Cards */}
      <Box sx={{ my: 4 }}>
        <DynamicGrid
          items={statsCards}
          spacing={3} // spacing between cards
        />
      </Box>

      {/* Dynamic Table */}
      <DynamicTable<OrderTaker>
        columns={columns}
        data={orderTakers}
        actions={actions}
        loading={isLoading}
        rowKey="id"
      />

      {/* QR Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm">
        <DialogTitle>QR Code for Waiter Registration</DialogTitle>
        <DialogContent>
          {qrCode && <img src={qrCode} alt="QR Code" style={{ maxWidth: '100%' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Set Work Schedule for {selectedWaiter?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="From Time"
              type="time"
              value={timeData.fromTime}
              onChange={(e) => setTimeData({ ...timeData, fromTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Time"
              type="time"
              value={timeData.toTime}
              onChange={(e) => setTimeData({ ...timeData, toTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateSchedule}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderTakersPage;

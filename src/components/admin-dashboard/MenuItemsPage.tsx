'use client';

import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import {
  DynamicTable,
  DynamicCard,
  DynamicGrid,
  Column,
  TableAction,
  GridItem,
} from '@/components/shared';
import {
  useGetAllMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  MenuItem,
} from '@/app/store/api';

const MenuItemsPage: React.FC = () => {
  const { data: menuItems = [], isLoading, error } = useGetAllMenuItemsQuery();
  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
  });

  // Stats calculation
  const stats = useMemo(() => ({
    total: menuItems.length,
    active: menuItems.filter((item) => item.isActive).length,
    inactive: menuItems.filter((item) => !item.isActive).length,
    avgPrice:
      menuItems.length > 0
        ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
        : 0,
  }), [menuItems]);

  // Table columns
  const columns: Column<MenuItem>[] = [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'sku', label: 'SKU', minWidth: 120 },
    {
  id: 'price',
  label: 'Price',
  minWidth: 100,
  align: 'right',
  format: (value) =>
    typeof value === 'number' ? `$${value.toFixed(2)}` : '—',
},
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value) => value || '—',
    },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (value) =>
        value === undefined ? '—' : <Chip label={value ? 'Active' : 'Inactive'} size="small" />,
    },
  ];

  // Table actions
  const actions: TableAction<MenuItem>[] = [
    {
      icon: <Eye size={18} />,
      label: 'View',
      onClick: (row) => console.log('View', row),
    },
    {
      icon: <Edit size={18} />,
      label: 'Edit',
      onClick: (row) => {
        setEditingItem(row);
        setFormData({
          name: row.name,
          price: row.price,
          description: row.description || '',
        });
        setDialogOpen(true);
      },
    },
    {
      icon: <Trash2 size={18} />,
      label: 'Delete',
      onClick: async (row) => {
        if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
          await deleteMenuItem(row.id);
        }
      },
    },
  ];

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem.id, ...formData }).unwrap();
      } else {
        await createMenuItem(formData).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({ name: '', price: 0, description: '' });
  };

  // Stats cards
  const statsCards: GridItem[] = [
    { id: 'total', xs: 12, sm: 6, md: 3, content: <DynamicCard title="Total Items" value={stats.total} subtitle="All menu items" /> },
    { id: 'active', xs: 12, sm: 6, md: 3, content: <DynamicCard title="Active Items" value={stats.active} subtitle="Currently available" /> },
    { id: 'inactive', xs: 12, sm: 6, md: 3, content: <DynamicCard title="Inactive Items" value={stats.inactive} subtitle="Temporarily unavailable" /> },
    { id: 'avgPrice', xs: 12, sm: 6, md: 3, content: <DynamicCard title="Average Price" value={`$${stats.avgPrice.toFixed(2)}`} subtitle="Across all items" /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Menu Items</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Item
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <DynamicGrid items={statsCards} spacing={3} />
      </Box>

      <DynamicTable<MenuItem>
        columns={columns}
        data={menuItems}
        actions={actions}
        loading={isLoading}
        error={error ? 'Failed to load menu items' : undefined}
        rowKey="id"
      />

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth required />
            <TextField label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} fullWidth required inputProps={{ step: '0.01', min: '0' }} />
            <TextField label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingItem ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuItemsPage;

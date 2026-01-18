"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Chip
} from '@mui/material';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import {
  DynamicTable, DynamicCard, DynamicGrid, Column, TableAction, GridItem
} from '@/components/shared';
import {
  useGetAllMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  MenuItem
} from '@/app/store/api';
import ButtonCom from '../Button';

const MenuItemsPage: React.FC = () => {
  const { data: menuItems = [], isLoading, error } = useGetAllMenuItemsQuery();
  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, description: '' });

  /** ------------------ Stats ------------------ */
  const stats = useMemo(() => ({
    total: menuItems.length,
    active: menuItems.filter(item => item.isActive).length,
    inactive: menuItems.filter(item => !item.isActive).length,
    avgPrice: menuItems.length > 0
      ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
      : 0
  }), [menuItems]);

  /** ------------------ Table Columns ------------------ */
  const columns: Column<MenuItem>[] = useMemo(() => [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'sku', label: 'SKU', minWidth: 120 },
    { id: 'price', label: 'Price', minWidth: 100, align: 'right',
      format: value => typeof value === 'number' ? `$${value.toFixed(2)}` : '—'
    },
    { id: 'description', label: 'Description', minWidth: 200,
      format: value => value || '—'
    },
    { id: 'isActive', label: 'Status', minWidth: 100, align: 'center', sortable: false,
      format: value => value === undefined ? '—' : <Chip label={value ? 'Active' : 'Inactive'} size="small" />
    }
  ], []);

  /** ------------------ Handlers ------------------ */
  const handleEdit = useCallback((row: MenuItem) => {
    setEditingItem(row);
    setFormData({ name: row.name, price: row.price, description: row.description || '' });
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (row: MenuItem) => {
    if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
      await deleteMenuItem(row.id);
    }
  }, [deleteMenuItem]);

  const actions: TableAction<MenuItem>[] = useMemo(() => [
    { icon: <Eye size={18} />, label: 'View', onClick: row => console.log('View', row) },
    { icon: <Edit size={18} />, label: 'Edit', onClick: handleEdit },
    { icon: <Trash2 size={18} />, label: 'Delete', onClick: handleDelete }
  ], [handleEdit, handleDelete]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({ name: '', price: 0, description: '' });
  }, []);

const handleSubmit = useCallback(async () => {
  try {
    if (editingItem) {
      await updateMenuItem({ id: editingItem.id, ...formData }).unwrap();
    } else {
      await createMenuItem(formData).unwrap();
    }
    handleCloseDialog(); // ab safe hai
  } catch (err) {
    console.error(err);
  }
}, [editingItem, formData, createMenuItem, updateMenuItem, handleCloseDialog]);



  /** ------------------ Stats Cards ------------------ */
  const statsCards: GridItem[] = useMemo(() => [
    { id: 'total', content: <DynamicCard title="Total Items" value={stats.total} subtitle="All menu items" /> },
    { id: 'active', content: <DynamicCard title="Active Items" value={stats.active} subtitle="Currently available" trend={{ value: stats.active, isPositive: true }} /> },
    { id: 'inactive', content: <DynamicCard title="Inactive Items" value={stats.inactive} subtitle="Temporarily unavailable" trend={{ value: stats.inactive, isPositive: false }} /> },
    { id: 'avgPrice', content: <DynamicCard title="Average Price" value={`$${stats.avgPrice.toFixed(2)}`} subtitle="Across all items" /> },
  ], [stats]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: { xs: 'block', sm: 'flex' }, justifyContent: { xs: 'center', sm: 'space-between' }, alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#1a1a1a' }}>Menu Items</Typography>
        <ButtonCom
          text="Add Item"
          icon={<Plus size={20} />}
          iconPosition="left"
          type="default"
          gradient
          className="rounded-lg shadow-md"
          onClick={() => setDialogOpen(true)}
        />
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <DynamicGrid items={statsCards} spacing={3} />
      </Box>

      {/* Menu Items Table */}
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
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))} fullWidth required />
            <TextField label="Price" type="number" value={formData.price} onChange={(e) => setFormData(f => ({ ...f, price: parseFloat(e.target.value) }))} fullWidth required inputProps={{ step: '0.01', min: '0' }} />
            <TextField label="Description" value={formData.description} onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))} fullWidth multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <ButtonCom text="Cancel" type="text" onClick={handleCloseDialog} />
          <ButtonCom text={editingItem ? 'Update' : 'Create'} gradient onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuItemsPage;

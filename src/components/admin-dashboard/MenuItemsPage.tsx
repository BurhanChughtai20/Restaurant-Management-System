"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { DynamicTable, DynamicCard, Column, TableAction } from "@/components/shared";
import ButtonCom from "../Button";
import {
  MenuItem,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetAdminMenuItemsQuery,
  useUpdateMenuItemMutation,
} from "@/app/store/api";

const INITIAL_FORM_STATE = { name: "", price: 0, description: "" };

const MenuItemsPage: React.FC = () => {
  // --- Data Fetching ---
  const { data, isLoading: isFetching } = useGetAdminMenuItemsQuery();
  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  // --- Local State ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // --- Memoized Menu Items ---
  const menuItems = useMemo(() => data?.data ?? [], [data]);

  // --- Stats Computation ---
  const stats = useMemo(() => {
    const total = menuItems.length;
    const active = menuItems.filter((i) => i.isActive).length;
    const avgPrice = total ? menuItems.reduce((sum, i) => sum + i.price, 0) / total : 0;
    return { total, active, inactive: total - active, avgPrice };
  }, [menuItems]);

  // --- Dialog Handlers ---
  const handleOpenDialog = useCallback((item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description || "",
      });
    } else {
      setEditingItem(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || formData.price < 0) return;
    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem.id, ...formData }).unwrap();
      } else {
        await createMenuItem(formData).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error("API Error:", err);
    }
  }, [editingItem, formData, createMenuItem, updateMenuItem, handleCloseDialog]);

  // --- Table Columns ---
  const columns: Column<MenuItem>[] = useMemo(
    () => [
      { id: "sku", label: "SKU", minWidth: 120 },
      { id: "name", label: "Item Name", minWidth: 150 },
      {
        id: "price",
        label: "Price",
        minWidth: 100,
        format: (v) => `$${Number(v).toFixed(2)}`,
      },
      {
        id: "isActive",
        label: "Status",
        format: (v) => <Chip label={v ? "Active" : "Inactive"} color={v ? "success" : "default"} size="small" />,
      },
    ],
    []
  );

  // --- Table Actions ---
  const actions: TableAction<MenuItem>[] = useMemo(
    () => [
      { icon: <Edit size={18} />, label: "Edit", onClick: (row) => row && handleOpenDialog(row) },
      {
        icon: <Trash2 size={18} />,
        label: "Delete",
        onClick: (row) => {
          if (row?.id && window.confirm(`Permanently delete ${row.name}?`)) {
            deleteMenuItem(row.id);
          }
        },
      },
    ],
    [deleteMenuItem, handleOpenDialog]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
          Menu Inventory
        </Typography>
        <ButtonCom text="Add New Item" type="default" gradient icon={<Plus size={18} />} onClick={() => handleOpenDialog()} />
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {[
          { label: "Total Items", val: stats.total, sub: "All items" },
          { label: "Active", val: stats.active, sub: "Live on menu" },
          { label: "Average Price", val: `$${stats.avgPrice.toFixed(2)}`, sub: "Per unit" },
        ].map((stat, idx) => (
          <Box key={idx} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 24px)", md: "1 1 calc(33.33% - 24px)" } }}>
            <DynamicCard title={stat.label} value={stat.val} subtitle={stat.sub} />
          </Box>
        ))}
      </Box>

      {/* Table */}
      <Box sx={{ boxShadow: "0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.1)", borderRadius: 2, bgcolor: "white", overflow: "hidden" }}>
        <DynamicTable<MenuItem> columns={columns} data={menuItems} actions={actions} loading={isFetching} rowKey="id" />
      </Box>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>{editingItem ? "Edit Menu Item" : "Create Menu Item"}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField label="Item Name" fullWidth variant="outlined" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
            <TextField
              label="Price ($)"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <ButtonCom text="Cancel" type="text" onClick={handleCloseDialog} icon={<X size={16} />} />
          <ButtonCom
            text={editingItem ? (isUpdating ? "Updating..." : "Update Item") : isCreating ? "Saving..." : "Save Item"}
            type="default"
            gradient
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            icon={<Save size={16} />}
            iconPosition="left"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuItemsPage;

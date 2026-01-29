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
import {
  DynamicTable,
  DynamicCard,
  Column,
  TableAction,
} from "@/components/shared";
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
  // Pagination state
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetAdminMenuItemsQuery({ cursor });

  const items = useMemo(() => {
    if (!data?.data) return [];
    const merged: MenuItem[] = [];
    const seen = new Set<number>();
    for (const item of data.data) {
      if (!seen.has(item.id)) {
        merged.push(item);
        seen.add(item.id);
      }
    }
    return merged;
  }, [data]);
  console.log("Items to render:", items);

  // Mutations
  const [createMenuItem, { isLoading: isCreating }] =
    useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

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

    const body = editingItem
      ? { ...formData }
      : {
          ...formData,
          sku: `${formData.name.toUpperCase().replace(/\s/g, "-")}-${Date.now()}`,
        };

    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem.id, ...body }).unwrap();
      } else {
        await createMenuItem(body).unwrap();
      }

      handleCloseDialog();
      setCursor(undefined); // reset pagination
    } catch (err) {
      console.error("API Error:", err);
    }
  }, [
    editingItem,
    formData,
    createMenuItem,
    updateMenuItem,
    handleCloseDialog,
  ]);

  // Table columns
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
        format: (v) => (
          <Chip
            label={v ? "Active" : "Inactive"}
            color={v ? "success" : "default"}
            size="small"
          />
        ),
      },
    ],
    [],
  );

  // Table actions
  const actions: TableAction<MenuItem>[] = useMemo(
    () => [
      {
        icon: <Edit size={18} />,
        label: "Edit",
        onClick: (row) => handleOpenDialog(row),
      },
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
    [deleteMenuItem, handleOpenDialog],
  );

  // Pagination: load next page
  const loadNextPage = useCallback(() => {
    if (data?.nextCursor) setCursor(data.nextCursor);
  }, [data]);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.isActive).length;
    const avgPrice = total
      ? items.reduce((sum, i) => sum + i.price, 0) / total
      : 0;
    return [
      {
        label: "Total Items",
        val: total,
        sub: "All items",
        progress: { value: total, max: 100 },
      },
      {
        label: "Active",
        val: active,
        sub: "Live on menu",
        progress: { value: active, max: total || 1 },
      },
      {
        label: "Average Price",
        val: `$${avgPrice.toFixed(2)}`,
        sub: "Per unit",
        progress: { value: avgPrice, max: 100 },
      },
    ];
  }, [items]);

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
        <ButtonCom
          text="Add New Item"
          type="default"
          gradient
          icon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
        />
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {stats.map((stat, idx) => (
          <Box
            key={idx}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 24px)",
                md: "1 1 calc(33.33% - 24px)",
              },
            }}
          >
            <DynamicCard
              title={stat.label}
              value={stat.val}
              subtitle={stat.sub}
              progress={stat.progress}
            />
          </Box>
        ))}
      </Box>

      {/* Table */}
      <Box
        sx={{
          boxShadow: "0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.1)",
          borderRadius: 2,
          bgcolor: "white",
          overflow: "hidden",
        }}
      >
        <DynamicTable<MenuItem>
          columns={columns}
          data={items}
          actions={actions}
          loading={isLoading}
          rowKey="id"
        />
        {data?.nextCursor && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <ButtonCom
              text="Load More"
              type="default"
              gradient
              onClick={loadNextPage}
            />
          </Box>
        )}
      </Box>

      {/* Dialog Form */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingItem ? "Edit Menu Item" : "Create Menu Item"}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Item Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
            />
            <TextField
              label="Price ($)"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) =>
                setFormData((p) => ({ ...p, price: Number(e.target.value) }))
              }
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <ButtonCom
            text="Cancel"
            type="text"
            onClick={handleCloseDialog}
            icon={<X size={16} />}
          />
          <ButtonCom
            text={
              editingItem
                ? isUpdating
                  ? "Updating..."
                  : "Update Item"
                : isCreating
                  ? "Saving..."
                  : "Save Item"
            }
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

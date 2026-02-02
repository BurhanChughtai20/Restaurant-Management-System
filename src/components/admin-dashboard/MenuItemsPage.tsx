// ============= ENTERPRISE-LEVEL MENU ITEMS MANAGEMENT =============
import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
} from "@mui/material"; 
import { useSelector } from "react-redux";  
import { MenuItem, MenuItemBody, UpdateMenuItemBody, useCreateMenuItemMutation, useDeleteMenuItemMutation, useGetAdminMenuItemsQuery, useUpdateMenuItemMutation } from "@/app/store/api";
import { CheckCircle, DeleteIcon, DollarSign, EditIcon, Package, XCircle } from "lucide-react";
import { Column, DynamicCard, DynamicTable, TableAction } from "../shared";
import ButtonCom from "../Button";
import { selectMenuItemsStats } from "@/app/store/selector/menuItemSelectors";

/* ============= TYPES & INTERFACES ============= */

interface MenuItemsPageProps {
  restaurantId: number;
}

interface FormState {
  name: string;
  sku: string;
  price: number;
  description: string;
  isActive: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

/* ============= FORM DIALOG COMPONENT ============= */

interface MenuItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  item?: MenuItem | null;
  restaurantId: number;
  onSubmit: (data: MenuItemBody | (UpdateMenuItemBody & { id: number })) => Promise<void>;
  isSubmitting: boolean;
}

const MenuItemFormDialog: React.FC<MenuItemFormDialogProps> = React.memo(
  ({ open, onClose, item, restaurantId, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<FormState>({
      name: "",
      sku: "",
      price: 0,
      description: "",
      isActive: true,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    // Reset form when dialog opens/closes or item changes
    React.useEffect(() => {
      if (open) {
        setFormData({
          name: item?.name || "",
          sku: item?.sku || "",
          price: item?.price || 0,
          description: item?.description || "",
          isActive: item?.isActive ?? true,
        });
        setErrors({});
      }
    }, [open, item]);

    // Validation
    const validate = useCallback((): boolean => {
      const newErrors: Partial<Record<keyof FormState, string>> = {};

      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.sku.trim()) {
        newErrors.sku = "SKU is required";
      } else if (!/^[A-Z0-9-]+$/i.test(formData.sku)) {
        newErrors.sku = "SKU must contain only letters, numbers, and hyphens";
      }

      if (formData.price <= 0) {
        newErrors.price = "Price must be greater than 0";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
      if (!validate()) return;

      const submitData = item
        ? { id: item.id, ...formData }
        : { ...formData, restaurantId };

      await onSubmit(submitData);
    }, [item, formData, restaurantId, onSubmit, validate]);

    const updateField = useCallback(
      <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
      [errors]
    );

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
            <TextField
              label="Item Name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name || "Enter a descriptive name for the item"}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="SKU"
              value={formData.sku}
              onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
              error={!!errors.sku}
              helperText={errors.sku || "Unique identifier (e.g., BURGER-001)"}
              required
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
              error={!!errors.price}
              helperText={errors.price || "Price in USD"}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <DollarSign size={18} style={{ marginRight: 8 }} />,
              }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              multiline
              rows={3}
              fullWidth
              helperText="Optional: Provide additional details about the item"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  color="primary"
                />
              }
              label={formData.isActive ? "Active (Visible to customers)" : "Inactive (Hidden from menu)"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={16} />}
          >
            {isSubmitting ? "Saving..." : item ? "Update Item" : "Create Item"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

MenuItemFormDialog.displayName = "MenuItemFormDialog";

/* ============= MAIN COMPONENT ============= */

const MenuItemsPage: React.FC<MenuItemsPageProps> = ({ restaurantId }) => {
  // ============= STATE MANAGEMENT =============
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // ============= API HOOKS =============
  const {
    data: menuItemsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAdminMenuItemsQuery({
    restaurantId,
    limit: 100, // Load more items for better UX
  });

  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  // ============= SELECTORS =============
  const stats = useSelector(selectMenuItemsStats);

  // ============= MEMOIZED DATA =============
  const menuItems = useMemo(() => menuItemsData?.data || [], [menuItemsData]);

  // Calculate trend data
  const trendData = useMemo(() => {
    const activePercentage = stats.total > 0 
      ? (stats.active / stats.total) * 100 
      : 0;
    
    return {
      activePercentage: activePercentage.toFixed(1),
      inactivePercentage: (100 - activePercentage).toFixed(1),
    };
  }, [stats]);

  // ============= SNACKBAR HELPER =============
  const showSnackbar = useCallback(
    (message: string, severity: SnackbarState["severity"]) => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // ============= HANDLERS =============
  const handleEdit = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedItem(null);
    setDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item: MenuItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await deleteMenuItem(itemToDelete.id).unwrap();
      showSnackbar(`Successfully deleted "${itemToDelete.name}"`, "success");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showSnackbar(
        `Failed to delete item: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error"
      );
    }
  }, [itemToDelete, deleteMenuItem, showSnackbar]);

  const handleFormSubmit = useCallback(
    async (data: MenuItemBody | (UpdateMenuItemBody & { id: number })) => {
      try {
        if ("id" in data) {
          await updateMenuItem(data).unwrap();
          showSnackbar(`Successfully updated "${data.name}"`, "success");
        } else {
          await createMenuItem(data).unwrap();
          showSnackbar(`Successfully created "${data.name}"`, "success");
        }
        setDialogOpen(false);
        setSelectedItem(null);
      } catch (err) {
        showSnackbar(
          `Operation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          "error"
        );
      }
    },
    [createMenuItem, updateMenuItem, showSnackbar]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedItem(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, []);

  // ============= TABLE CONFIGURATION =============
  const columns: Column<MenuItem>[] = useMemo(
    () => [
      {
        id: "sku",
        label: "SKU",
        minWidth: 120,
        sortable: true,
        searchable: true,
      },
      {
        id: "name",
        label: "Item Name",
        minWidth: 200,
        sortable: true,
        searchable: true,
        format: (value) => (
          <Box sx={{ fontWeight: 500, color: "text.primary" }}>
            {String(value)}
          </Box>
        ),
      },
      {
        id: "price",
        label: "Price",
        minWidth: 100,
        align: "right",
        sortable: true,
        format: (value) => (
          <Box sx={{ fontWeight: 600, color: "success.main" }}>
            ${Number(value).toFixed(2)}
          </Box>
        ),
      },
      {
        id: "description",
        label: "Description",
        minWidth: 250,
        searchable: true,
        format: (value) => (
          <Box
            sx={{
              maxWidth: 250,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value || "—"}
          </Box>
        ),
      },
      {
        id: "isActive",
        label: "Status",
        minWidth: 100,
        align: "center",
        sortable: true,
        format: (value) => (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: value ? "success.light" : "error.light",
              color: value ? "success.dark" : "error.dark",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {value ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {value ? "Active" : "Inactive"}
          </Box>
        ),
      },
    ],
    []
  );

  const tableActions: TableAction<MenuItem>[] = useMemo(
    () => [
      {
        icon: <EditIcon fontSize="small" />,
        label: "Edit",
        onClick: handleEdit,
      },
      {
        icon: <DeleteIcon fontSize="small" color="error" />,
        label: "Delete",
        onClick: handleDeleteClick,
      },
    ],
    [handleEdit, handleDeleteClick]
  );

  // ============= ERROR STATE =============
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load menu items. Please try again.
        </Alert>
        <ButtonCom text="Retry" onClick={refetch} type="primary" />
      </Box>
    );
  }

  // ============= RENDER =============
  return (
    <Box sx={{ p: 3 }}>
      {/* ============= STATS DASHBOARD ============= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <DynamicCard
          title="Total Items"
          value={stats.total}
          subtitle="Total menu items in inventory"
          icon={<Package size={24} />}
          progress={{
            value: stats.total,
            max: 100,
            label: "Capacity",
          }}
          loading={isLoading}
        />

        <DynamicCard
          title="Active Items"
          value={stats.active}
          subtitle={`${trendData.activePercentage}% of total inventory`}
          icon={<CheckCircle size={24} />}
          trend={{
            value: parseFloat(trendData.activePercentage),
            isPositive: true,
            label: "of inventory",
          }}
          progress={{
            value: stats.active,
            max: stats.total,
            label: "Active",
          }}
          loading={isLoading}
        />

        <DynamicCard
          title="Inactive Items"
          value={stats.inactive}
          subtitle={`${trendData.inactivePercentage}% of total inventory`}
          icon={<XCircle size={24} />}
          trend={{
            value: parseFloat(trendData.inactivePercentage),
            isPositive: false,
            label: "of inventory",
          }}
          progress={{
            value: stats.inactive,
            max: stats.total,
            label: "Inactive",
          }}
          loading={isLoading}
        />

        <DynamicCard
          title="Average Price"
          value={`$${stats.avgPrice.toFixed(2)}`}
          subtitle="Per menu item"
          icon={<DollarSign size={24} />}
          trend={{
            value: 12.5,
            isPositive: true,
            label: "vs last month",
          }}
          loading={isLoading}
        />
      </Box>

      {/* ============= CONTROLS ============= */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "flex-end" }}>
        <ButtonCom
          text="Add New Item"
          onClick={handleAdd}
          type="primary"
          gradient
        />

        <ButtonCom
          text={isFetching ? "Refreshing..." : "Refresh"}
          onClick={refetch}
          type="default"
          disabled={isFetching}
        />
      </Box>

      {/* ============= DATA TABLE ============= */}
      <DynamicTable
        columns={columns}
        data={menuItems}
        actions={tableActions}
        loading={isLoading}
        rowKey="id"
      />

      {/* ============= DIALOGS ============= */}
      <MenuItemFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        item={selectedItem}
        restaurantId={restaurantId}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone
          </Alert>
          <Box>
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting && <CircularProgress size={16} />}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============= SNACKBAR NOTIFICATIONS ============= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuItemsPage;
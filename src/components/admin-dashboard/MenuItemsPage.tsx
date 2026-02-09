"use client";

import { useCallback, useMemo, useState } from "react";
import { DataTable } from "./table/data-table";
import { createMenuItemColumns } from "./tables/menu-items-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "@/app/store/api";
import type { MenuItem } from "@/app/store/api/types";
import { useAlert } from "../DynamicAlert";
import { useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/app/store/slices/authSlice";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const MenuItemsPage = () => {
  const authUser = useAppSelector(selectUser);
  const restaurantId = authUser?.restaurantId;

  const { showAlert } = useAlert();

  // ---- API hooks ----
  const {
    data: menuData,
    isLoading,
    isError,
    isFetching,
  } = useGetAdminMenuItemsQuery();

  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  // ---- Modal state ----
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // ---- Form state (shared for add / edit) ----
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");

  // ---- Handlers ----
  const openAddDialog = () => {
    setFormName("");
    setFormPrice("");
    setEditingItem(null);
    setIsAddOpen(true);
  };

  const openEditDialog = useCallback((item: MenuItem) => {
    setFormName(item.name);
    setFormPrice(String(item.price));
    setEditingItem(item);
    setIsAddOpen(true);
  }, []);

  const closeDialog = () => {
    setIsAddOpen(false);
    setEditingItem(null);
  };

  const handleCreate = async () => {
    if (!restaurantId) return;
    try {
      await createMenuItem({
        name: formName.trim(),
        price: parseFloat(formPrice),
        restaurantId,
      }).unwrap();
      showAlert("Menu item created successfully!", "success");
      closeDialog();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Failed to create menu item", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !restaurantId) return;
    try {
      await updateMenuItem({
        id: editingItem.id,
        restaurantId,
        name: formName.trim(),
        price: parseFloat(formPrice),
      }).unwrap();
      showAlert("Menu item updated successfully!", "success");
      closeDialog();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Failed to update menu item", "error");
    }
  };

  const handleSubmit = () => {
    if (editingItem) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // ---- Delete ----
  const openDeleteDialog = useCallback((item: MenuItem) => {
    setDeletingItem(item);
  }, []);

  const closeDeleteDialog = () => {
    setDeletingItem(null);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMenuItem({ id: deletingItem.id }).unwrap();
      showAlert("Menu item deleted successfully!", "success");
      closeDeleteDialog();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Failed to delete menu item", "error");
    }
  };

  // ---- Table columns (memoised, depends on edit/delete handlers) ----
  const columns = useMemo(
    () => createMenuItemColumns(openEditDialog, openDeleteDialog),
    [openEditDialog, openDeleteDialog]
  );

  const tableData = useMemo(() => menuData?.data ?? [], [menuData]);

  // ---- Render ----
  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading menu items...</div>;
  }

  if (isError) {
    return <div className="p-6 text-destructive">Failed to load menu items.</div>;
  }

  return (
    <div className="flex flex-col h-full md:p-3 w-full">
      <div className="flex-1 space-y-4 p-4 md:p-3 pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <span className="hover:text-foreground transition-colors">Dashboard</span>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span className="text-foreground font-medium">Menu Items</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Menu Items</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your restaurant menu items.
            </p>
          </div>

          <Button variant="default" size="sm" onClick={openAddDialog}>
            + Add New Item
          </Button>
        </div>

        {/* Table */}
        <div className="relative">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-md">
              <span className="text-sm text-muted-foreground">Refreshing...</span>
            </div>
          )}
          <DataTable columns={columns} data={tableData} />
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details of this menu item."
                : "Add a new item to the menu."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-4 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                type="text"
                placeholder="e.g. French Fries"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-price">Price</Label>
              <Input
                id="item-price"
                type="number"
                placeholder="e.g. 3.50"
                required
                min="0"
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingItem
                    ? "Update"
                    : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => { if (!open) closeDeleteDialog(); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingItem?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuItemsPage;

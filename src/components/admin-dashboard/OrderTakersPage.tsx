"use client";

import { useCallback, useMemo, useState } from "react";
import { DataTable } from "./table/data-table";
import { createOrderTakerColumns } from "./tables/order-takers-columns";
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
import type { OrderTaker } from "@/app/store/api/types";
import {
  useGetAllOrderTakersQuery,
  useLazyGetWaiterTokenQuery,
  useUpdateWaiterMutation,
  useDeleteOrderTakerConnectionMutation,
} from "@/app/store/api/orderTakersApi";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const OrderTakersPage = () => {
  // ---- Modal state ----
  const [deletingItem, setDeletingItem] = useState<OrderTaker | null>(null);
  const [editingItem, setEditingItem] = useState<OrderTaker | null>(null);
  const [editName, setEditName] = useState("");
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const { data: waitersResponse, isLoading: isWaitersLoading, isError: isWaitersError } = useGetAllOrderTakersQuery();
  const [getWaiterToken, { isLoading: isTokenLoading }] = useLazyGetWaiterTokenQuery();
  const [updateWaiter] = useUpdateWaiterMutation();
  const [deleteConnection] = useDeleteOrderTakerConnectionMutation();

  const tableData = waitersResponse?.data ?? [];

  const handleGenerateQR = useCallback(async () => {
    try {
      const result = await getWaiterToken().unwrap();
      if (result?.sessionToken) setSessionToken(result.sessionToken);
    } catch (e) {
      console.error("Failed to get waiter token", e);
    }
  }, [getWaiterToken]);

  const handleTokenModalClose = useCallback((open: boolean) => {
    if (!open) setSessionToken(null);
    setIsTokenOpen(open);
  }, []);

  // ---- Delete ----
  const openDeleteDialog = useCallback((item: OrderTaker) => {
    setDeletingItem(item);
  }, []);

  const closeDeleteDialog = () => {
    setDeletingItem(null);
  };

  const handleDelete = useCallback(async () => {
    const connectionId = deletingItem?.waiterConnection?.id;
    if (connectionId == null) return;
    try {
      await deleteConnection({ connectionId }).unwrap();
      closeDeleteDialog();
    } catch (e) {
      console.error("Failed to delete connection", e);
    }
  }, [deletingItem, deleteConnection]);

  const openEditDialog = useCallback((item: OrderTaker) => {
    setEditingItem(item);
    setEditName(item.name.trim());
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditingItem(null);
    setEditName("");
  }, []);

  const handleEditSave = useCallback(async () => {
    if (!editingItem) return;
    try {
      await updateWaiter({
        orderTakerId: editingItem.id,
        name: editName,
      }).unwrap();
      closeEditDialog();
    } catch (e) {
      console.error("Failed to update waiter", e);
    }
  }, [editingItem, editName, updateWaiter, closeEditDialog]);

  // ---- Table columns ----
  const columns = useMemo(
    () => createOrderTakerColumns(openEditDialog, openDeleteDialog),
    [openEditDialog, openDeleteDialog]
  );

  // ---- Render ----
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
              <span className="text-foreground font-medium">Order Takers</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Order Takers</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your restaurant order takers.
            </p>
          </div>

          <Button variant="default" size="sm" onClick={() => setIsTokenOpen(true)}>
            + Generate Token
          </Button>
        </div>

        {/* Table */}
        {isWaitersLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Loading order takers…
          </div>
        ) : isWaitersError ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            Failed to load order takers.
          </div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>

      {/* Token / QR Code Dialog */}
      <Dialog open={isTokenOpen} onOpenChange={handleTokenModalClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Order Taker Token</DialogTitle>
            <DialogDescription>
              Generate a QR code and share it with the order taker to connect.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {sessionToken ? (
              <>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sessionToken)}`}
                  alt="QR Code"
                  className="w-48 h-48 rounded-md border"
                />
                <div className="w-full">
                  <p className="text-xs text-muted-foreground mb-1">Token</p>
                  <code className="block w-full rounded-md bg-muted p-3 text-sm break-all select-all">
                    {sessionToken}
                  </code>
                </div>
              </>
            ) : (
              <div className="w-48 h-48 rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                QR will appear here
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="default"
              onClick={handleGenerateQR}
              disabled={isTokenLoading}
            >
              {isTokenLoading ? "Generating…" : "Generate QR"}
            </Button>
            <Button variant="outline" onClick={() => handleTokenModalClose(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) closeEditDialog(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order Taker</DialogTitle>
            <DialogDescription>
              Update the order taker name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => { if (!open) closeDeleteDialog(); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the connection for{" "}
              <span className="font-semibold text-foreground">
                {deletingItem?.name}
              </span>
              ? They will need a new token to reconnect.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTakersPage;

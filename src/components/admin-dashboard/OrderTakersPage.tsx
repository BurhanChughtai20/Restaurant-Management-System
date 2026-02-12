"use client";

import { useCallback, useMemo, useState } from "react";
import { DataTable } from "./table/data-table";
import { createOrderTakerColumns } from "./tables/order-takers-columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { OrderTaker } from "@/app/store/api/types";

// ---------------------------------------------------------------------------
// Hardcoded data
// ---------------------------------------------------------------------------
const STATIC_ORDER_TAKERS: OrderTaker[] = [
  {
    id: 1,
    restaurantId: 14,
    name: "Ali Khan",
    email: "ali.khan@example.com",
    isEmailVerified: true,
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
    waiterConnection: {
      id: 1,
      orderTakerId: 1,
      sessionToken: "tok_abc123",
      isActive: true,
      createdAt: "2026-02-01T08:00:00Z",
      updatedAt: "2026-02-09T12:00:00Z",
    },
  },
  {
    id: 2,
    restaurantId: 14,
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    isEmailVerified: true,
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-02-05T11:00:00Z",
    waiterConnection: {
      id: 2,
      orderTakerId: 2,
      sessionToken: "tok_def456",
      isActive: false,
      createdAt: "2026-02-05T11:00:00Z",
      updatedAt: "2026-02-08T18:00:00Z",
    },
  },
  {
    id: 3,
    restaurantId: 14,
    name: "Usman Raza",
    email: "usman.raza@example.com",
    isEmailVerified: false,
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-02-09T09:00:00Z",
  },
  {
    id: 4,
    restaurantId: 14,
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    isEmailVerified: true,
    createdAt: "2026-01-10T07:30:00Z",
    updatedAt: "2026-02-07T16:00:00Z",
    waiterConnection: {
      id: 3,
      orderTakerId: 4,
      sessionToken: "tok_ghi789",
      isActive: true,
      createdAt: "2026-02-07T16:00:00Z",
      updatedAt: "2026-02-09T10:00:00Z",
    },
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const OrderTakersPage = () => {
  // ---- Modal state ----
  const [deletingItem, setDeletingItem] = useState<OrderTaker | null>(null);
  const [isTokenOpen, setIsTokenOpen] = useState(false);

  // ---- Delete ----
  const openDeleteDialog = useCallback((item: OrderTaker) => {
    setDeletingItem(item);
  }, []);

  const closeDeleteDialog = () => {
    setDeletingItem(null);
  };

  const handleDelete = () => {
    // TODO: integrate API later
    console.log("Delete connection for:", deletingItem?.name);
    closeDeleteDialog();
  };

  // ---- Table columns ----
  const columns = useMemo(
    () => createOrderTakerColumns(openDeleteDialog),
    [openDeleteDialog]
  );

  const tableData = STATIC_ORDER_TAKERS;

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
        <DataTable columns={columns} data={tableData} />
      </div>

      {/* Token / QR Code Dialog */}
      <Dialog open={isTokenOpen} onOpenChange={setIsTokenOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Order Taker Token</DialogTitle>
            <DialogDescription>
              Share this QR code with the order taker to connect.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {/* QR Code placeholder using a public QR API */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=order-taker-token-sample"
              alt="QR Code"
              className="w-48 h-48 rounded-md border"
            />
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-1">Token</p>
              <code className="block w-full rounded-md bg-muted p-3 text-sm break-all select-all">
                tok_sample_abc123xyz789
              </code>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTokenOpen(false)}>
              Close
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

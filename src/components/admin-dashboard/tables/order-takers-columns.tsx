"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { OrderTaker } from "@/app/store/api/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const createOrderTakerColumns = (
  onDelete: (item: OrderTaker) => void
): ColumnDef<OrderTaker>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        #{row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "isEmailVerified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.getValue<boolean>("isEmailVerified");
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            verified
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          {verified ? "Verified" : "Pending"}
        </span>
      );
    },
  },
  {
    id: "connection",
    header: "Connection",
    cell: ({ row }) => {
      const connection = row.original.waiterConnection;
      const isActive = connection?.isActive;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {isActive ? "Online" : "Offline"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const hasConnection = !!row.original.waiterConnection;
      if (!hasConnection) return null;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          title="Remove connection"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];

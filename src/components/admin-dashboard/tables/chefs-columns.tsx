"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Chef } from "@/app/store/api/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const createChefColumns = (
  onEdit: (item: Chef) => void,
  onDelete: (item: Chef) => void
): ColumnDef<Chef>[] => [
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
      const connection = row.original.chefConnection;
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
      const item = row.original;
      const hasConnection = !!item.chefConnection;
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            title="Edit"
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {hasConnection && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item)}
              title="Remove connection"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

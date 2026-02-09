"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { MenuItem } from "@/app/store/api/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const createMenuItemColumns = (
  onEdit: (item: MenuItem) => void,
  onDelete: (item: MenuItem) => void
): ColumnDef<MenuItem>[] => [
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
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs font-mono">
        {row.getValue("sku") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      return <span className="font-semibold">${price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("isActive");
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          title="Edit item"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          title="Delete item"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

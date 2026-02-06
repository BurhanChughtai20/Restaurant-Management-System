"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Orders } from "../types";

export const ordersColumns: ColumnDef<Orders>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "email",
    header: "Customer Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize font-medium">
        {row.getValue("status")}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Total",
    cell: ({ row }) => `$${row.getValue<number>("amount")}`,
  },
];

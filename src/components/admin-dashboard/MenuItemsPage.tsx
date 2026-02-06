"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DynamicContent from "../Title";
import { DataTable } from "./table/data-table"; 
import type { Orders } from "./types";
import { ordersColumns } from "./tables/orders-columns.ts";
import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DynamicCardForm } from "../FormInput";

// Static table data
const STATIC_TABLE_DATA: Orders[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
];

// Dashboard header content
const DASHBOARD_HEADER_CONTENT = [
  { as: "h2" as const, className: "text-2xl sm:text-3xl font-bold", content: "Dashboard Overview" },
  { as: "p" as const, className: "text-muted-foreground", content: "Real-time performance metrics across all channels." },
];

const FORM_TITLE = [
  { as: "h2" as const, className: "text-2xl sm:text-3xl font-bold", content: "Add New Item" },
  { as: "p" as const, className: "text-muted-foreground", content: "Add a new item to the menu." },
]
// ✅ Dynamic form fields defined once
const FORM_FIELDS = [
  { id: "name", label: "Item Name", placeholder: "Enter item name", type: "text", required: true },
  { id: "price", label: "Price", placeholder: "Enter price", type: "number", required: true },
  { id: "email", label: "Customer Email", placeholder: "Enter email", type: "email", required: false },
];

const MenuItemsPage = () => {
  const [tableData, setTableData] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Dynamic form state based on FORM_FIELDS
  const initialFormState = FORM_FIELDS.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {} as Record<string, string>);

  const [formValues, setFormValues] = useState<Record<string, string>>(initialFormState);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      await new Promise((res) => setTimeout(res, 300));
      setTableData(STATIC_TABLE_DATA);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const memoizedTableData = useMemo(() => tableData, [tableData]);

  const handleFormChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    console.log("Form submitted:", formValues);
    setIsModalOpen(false);
    setFormValues(initialFormState); // reset form after submit
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading Analytics...</div>;
  if (isError) return <div className="p-6 text-destructive">Failed to load data.</div>;

  return (
    <div className="flex flex-col h-full md:p-3 w-full">
      <div className="flex-1 space-y-4 p-4 md:p-3 pt-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            {DASHBOARD_HEADER_CONTENT.map(({ as, className, content }) => (
              <DynamicContent key={content} as={as} className={className}>
                {content}
              </DynamicContent>
            ))}
          </div>

          <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
            Add New Item
          </Button>
        </div>

        {/* Table */}
        <div className="container mx-auto p-3">
          <DataTable columns={ordersColumns} data={memoizedTableData} />
        </div>
      </div>

      {/* Modal with Dynamic Form */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md w-full">
              <DialogTitle>
                {FORM_TITLE.map(({ as, className, content }) => (
                  <DynamicContent key={content} as={as} className={className}>
                    {content}
                  </DynamicContent>
                ))}
              </DialogTitle>

            <DynamicCardForm
              title="New Order"
              description="Fill in the order details below"
              fields={FORM_FIELDS.map((field) => ({
                ...field,
                value: formValues[field.id],
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(field.id, e.target.value),
              }))}
              actionButton={{
                text: "Save",
                onClick: handleFormSubmit,
              }}
              footerButtons={[
                {
                  text: "Cancel",
                  onClick: () => setIsModalOpen(false),
                  variant: "outline",
                },
              ]}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MenuItemsPage;

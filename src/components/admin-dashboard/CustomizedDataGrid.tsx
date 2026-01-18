"use client";

import React, { useCallback } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';
import type { DataGridConfig } from './types';

const COLUMN_ID_WIDTH = 90;
const COLUMN_NAME_WIDTH = 150;
const COLUMN_EMAIL_WIDTH = 200;
const COLUMN_ROLE_WIDTH = 120;
const COLUMN_STATUS_WIDTH = 120;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

const EVEN_ROW_CLASS = 'even';
const ODD_ROW_CLASS = 'odd';
const ROW_INDEX_DIVISOR = 2;

export const defaultColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: COLUMN_ID_WIDTH },
  { field: 'name', headerName: 'Name', width: COLUMN_NAME_WIDTH },
  { field: 'email', headerName: 'Email', width: COLUMN_EMAIL_WIDTH },
  { field: 'role', headerName: 'Role', width: COLUMN_ROLE_WIDTH },
  { field: 'status', headerName: 'Status', width: COLUMN_STATUS_WIDTH },
];

export const defaultRows: GridRowsProp = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export const getRowClassName = (params: { indexRelativeToCurrentPage: number }) => {
  const isEvenIndex = params.indexRelativeToCurrentPage % ROW_INDEX_DIVISOR === 0;
  return isEvenIndex ? EVEN_ROW_CLASS : ODD_ROW_CLASS;
};

export const getFilterPanelProps = () => ({
  filterFormProps: {
    logicOperatorInputProps: { variant: 'outlined' as const, size: 'small' as const },
    columnInputProps: { variant: 'outlined' as const, size: 'small' as const, sx: { mt: 'auto' } },
    operatorInputProps: { variant: 'outlined' as const, size: 'small' as const, sx: { mt: 'auto' } },
    valueInputProps: { InputComponentProps: { variant: 'outlined' as const, size: 'small' as const } },
  },
});

// ---------------- CustomizedDataGrid ----------------
const CustomizedDataGrid: React.FC<DataGridConfig> = ({
  rows,
  columns,
  pageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  checkboxSelection = true,
  onSelectionChange,
}) => {
  const handleSelectionChange = useCallback(
    (selectionModel: GridRowSelectionModel) => {
      if (onSelectionChange) onSelectionChange(selectionModel);
    },
    [onSelectionChange] // dependency array ensures correct updates if prop changes
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={pageSizeOptions}
      initialState={{ pagination: { paginationModel: { pageSize } } }}
      checkboxSelection={checkboxSelection}
      onRowSelectionModelChange={handleSelectionChange}
      density="compact"
      getRowClassName={getRowClassName}
      autoHeight
    />
  );
};

export default React.memo(CustomizedDataGrid);

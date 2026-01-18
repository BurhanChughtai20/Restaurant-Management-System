'use client';

import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination,
  TableSortLabel, Paper, IconButton,
  TextField, Box, Tooltip,
  Typography, Skeleton
} from '@mui/material';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  searchable?: boolean;
  format?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
}

export interface TableAction<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  error?: string;
  rowKey: keyof T;
}

type Order = 'asc' | 'desc';

// Motion-enabled TableRow
const MotionTableRow = motion(TableRow);

export default function DynamicTable<T extends object>({
  columns,
  data,
  actions = [],
  loading = false,
  error,
  rowKey,
}: DynamicTableProps<T>) {
  const [order] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(
    columns.length ? columns[0].id : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col =>
        col.searchable !== false &&
        String(row[col.id] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const displayData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const showSkeleton = loading || displayData.length === 0;

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper>
      <Box p={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search size={18} /> }}
        />
      </Box>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={`${String(col.id)}-${i}`}>
                  {col.sortable === false ? col.label : (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={order}
                      onClick={() => setOrderBy(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {showSkeleton ? (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, c) => (
                    <TableCell key={c}>
                      <Skeleton variant="text" height={24} />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <AnimatePresence>
                {displayData.map((row, rIndex) => (
                  <MotionTableRow
                    key={`${String(row[rowKey])}-${rIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  >
                    {columns.map((col, cIndex) => (
                      <TableCell key={`${String(col.id)}-${cIndex}`}>
                        {col.format ? col.format(row[col.id], row) : String(row[col.id])}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        {actions.map((action, aIndex) =>
                          (!action.show || action.show(row)) && (
                            <Tooltip key={aIndex} title={action.label}>
                              <IconButton onClick={() => action.onClick(row)}>
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          )
                        )}
                      </TableCell>
                    )}
                  </MotionTableRow>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
      />
    </Paper>
  );
}

# Migration Guide: Applying Clean Code Patterns

## Overview

This guide shows you step-by-step how to refactor existing dashboard pages (Menu Items, Chefs, Order Takers, etc.) using the patterns established in the Articles page.

---

## 🎯 Quick Start Template

### 1. Create Custom Hook (useMenuItems.ts)

```typescript
/**
 * Menu Items Page Hook
 * Manages all business logic for menu items
 */

import { useState, useCallback, useMemo } from 'react';
import {
    useGetMenuItemsQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
    MenuItem,
} from '@/app/store/api';

// TYPES
interface MenuItemFormData {
    name: string;
    sku: string;
    price: number;
    description: string;
    isActive: boolean;
}

const INITIAL_FORM_DATA: MenuItemFormData = {
    name: '',
    sku: '',
    price: 0,
    description: '',
    isActive: true,
};

// FORM HOOK
export function useMenuItemForm(initialData?: Partial<MenuItemFormData>) {
    const [formData, setFormData] = useState<MenuItemFormData>({
        ...INITIAL_FORM_DATA,
        ...initialData,
    });

    const updateField = useCallback(<K extends keyof MenuItemFormData>(
        field: K,
        value: MenuItemFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
    }, []);

    const loadMenuItem = useCallback((item: MenuItem) => {
        setFormData({
            name: item.name,
            sku: item.sku,
            price: item.price,
            description: item.description || '',
            isActive: item.isActive,
        });
    }, []);

    return { formData, updateField, resetForm, loadMenuItem, setFormData };
}

// DIALOG HOOK
export function useMenuItemDialog() {
    const [state, setState] = useState({
        isOpen: false,
        editingItem: null as MenuItem | null,
    });

    const openForCreate = useCallback(() => {
        setState({ isOpen: true, editingItem: null });
    }, []);

    const openForEdit = useCallback((item: MenuItem) => {
        setState({ isOpen: true, editingItem: item });
    }, []);

    const close = useCallback(() => {
        setState({ isOpen: false, editingItem: null });
    }, []);

    return { ...state, openForCreate, openForEdit, close };
}

// MAIN HOOK
export function useMenuItemsPage(page = 1) {
    // API
    const { data, isLoading, error } = useGetMenuItemsQuery({ page });
    const [create, { isLoading: isCreating }] = useCreateMenuItemMutation();
    const [update, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
    const [remove, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

    // State
    const form = useMenuItemForm();
    const dialog = useMenuItemDialog();

    // Derived
    const items = useMemo(() => data?.data || [], [data]);
    const pagination = useMemo(() => data?.pagination, [data]);
    
    const stats = useMemo(() => ({
        total: pagination?.totalItems || 0,
        active: items.filter(i => i.isActive).length,
        inactive: items.filter(i => !i.isActive).length,
    }), [items, pagination]);

    // Actions
    const handleCreateOrUpdate = useCallback(async () => {
        try {
            if (dialog.editingItem) {
                await update({
                    id: dialog.editingItem.id,
                    data: form.formData,
                }).unwrap();
            } else {
                await create(form.formData).unwrap();
            }
            dialog.close();
            form.resetForm();
        } catch (err) {
            console.error('Failed to save menu item:', err);
            throw err;
        }
    }, [dialog, form, update, create]);

    const handleDelete = useCallback(async (item: MenuItem) => {
        const confirmed = window.confirm(`Delete "${item.name}"?`);
        if (confirmed) {
            try {
                await remove(item.id).unwrap();
            } catch (err) {
                console.error('Failed to delete menu item:', err);
                throw err;
            }
        }
    }, [remove]);

    const handleEdit = useCallback((item: MenuItem) => {
        form.loadMenuItem(item);
        dialog.openForEdit(item);
    }, [form, dialog]);

    return {
        items,
        pagination,
        stats,
        isLoading,
        error,
        form,
        dialog,
        handleCreateOrUpdate,
        handleDelete,
        handleEdit,
        isSaving: isCreating || isUpdating,
        isDeleting,
    };
}
```

---

### 2. Create Column Configuration (config/columns.tsx)

```typescript
/**
 * Menu Items Column Configuration
 */

import React from 'react';
import { Chip, Typography } from '@mui/material';
import { Column } from '@/components/shared';
import { MenuItem } from '@/app/store/api';

const COLUMN_WIDTHS = {
    ID: 70,
    NAME: 200,
    SKU: 150,
    PRICE: 120,
    STATUS: 120,
} as const;

function formatPrice(value: number) {
    return `$${value.toFixed(2)}`;
}

function formatStatus(value: boolean) {
    return (
        <Chip
            label={value ? 'Active' : 'Inactive'}
            color={value ? 'success' : 'default'}
            size="small"
        />
    );
}

export function useMenuItemColumns(): Column<MenuItem>[] {
    return React.useMemo(() => [
        {
            id: 'id',
            label: 'ID',
            minWidth: COLUMN_WIDTHS.ID,
        },
        {
            id: 'name',
            label: 'Name',
            minWidth: COLUMN_WIDTHS.NAME,
        },
        {
            id: 'sku',
            label: 'SKU',
            minWidth: COLUMN_WIDTHS.SKU,
        },
        {
            id: 'price',
            label: 'Price',
            minWidth: COLUMN_WIDTHS.PRICE,
            format: formatPrice,
        },
        {
            id: 'isActive',
            label: 'Status',
            align: 'center',
            format: formatStatus,
        },
    ], []);
}
```

---

### 3. Create Actions Configuration (config/actions.tsx)

```typescript
/**
 * Menu Items Actions Configuration
 */

import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { TableAction } from '@/components/shared';
import { MenuItem } from '@/app/store/api';

const ICON_SIZE = 18;

interface MenuItemActionHandlers {
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
}

export function useMenuItemActions(
    handlers: MenuItemActionHandlers
): TableAction<MenuItem>[] {
    const { onEdit, onDelete } = handlers;

    return React.useMemo(() => [
        {
            icon: <Edit size={ICON_SIZE} />,
            label: 'Edit',
            onClick: onEdit,
            color: 'primary' as const,
        },
        {
            icon: <Trash2 size={ICON_SIZE} />,
            label: 'Delete',
            onClick: onDelete,
            color: 'error' as const,
        },
    ], [onEdit, onDelete]);
}
```

---

### 4. Create Grid Configuration (config/gridItems.tsx)

```typescript
/**
 * Menu Items Grid Configuration
 */

import React from 'react';
import { GridItem, DynamicCard } from '@/components/shared';

interface MenuItemStats {
    total: number;
    active: number;
    inactive: number;
}

const GRID_BREAKPOINTS = {
    XS: 12,
    SM: 6,
    MD: 4,
} as const;

export function useMenuItemGridItems(stats: MenuItemStats): GridItem[] {
    return React.useMemo(() => [
        {
            id: 'total',
            xs: GRID_BREAKPOINTS.XS,
            sm: GRID_BREAKPOINTS.SM,
            md: GRID_BREAKPOINTS.MD,
            content: (
                <DynamicCard
                    title="Total Items"
                    value={stats.total}
                    subtitle="All menu items"
                    color="primary"
                    variant="gradient"
                />
            ),
        },
        {
            id: 'active',
            xs: GRID_BREAKPOINTS.XS,
            sm: GRID_BREAKPOINTS.SM,
            md: GRID_BREAKPOINTS.MD,
            content: (
                <DynamicCard
                    title="Active"
                    value={stats.active}
                    subtitle="Currently available"
                    color="success"
                />
            ),
        },
        {
            id: 'inactive',
            xs: GRID_BREAKPOINTS.XS,
            sm: GRID_BREAKPOINTS.SM,
            md: GRID_BREAKPOINTS.MD,
            content: (
                <DynamicCard
                    title="Inactive"
                    value={stats.inactive}
                    subtitle="Not available"
                    color="warning"
                />
            ),
        },
    ], [stats]);
}
```

---

### 5. Create Form Dialog (components/MenuItemDialog.tsx)

```typescript
/**
 * Menu Item Form Dialog
 */

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControlLabel,
    Switch,
    CircularProgress,
} from '@mui/material';
import { MenuItem } from '@/app/store/api';

interface MenuItemFormData {
    name: string;
    sku: string;
    price: number;
    description: string;
    isActive: boolean;
}

interface MenuItemDialogProps {
    open: boolean;
    editingItem: MenuItem | null;
    formData: MenuItemFormData;
    onFieldChange: <K extends keyof MenuItemFormData>(
        field: K,
        value: MenuItemFormData[K]
    ) => void;
    onSubmit: () => Promise<void>;
    onClose: () => void;
    isLoading?: boolean;
}

const DIALOG_CONFIG = {
    maxWidth: 'md' as const,
    descriptionRows: 4,
};

export const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
    open,
    editingItem,
    formData,
    onFieldChange,
    onSubmit,
    onClose,
    isLoading = false,
}) => {
    const title = editingItem ? 'Edit Menu Item' : 'Create Menu Item';
    const submitLabel = editingItem ? 'Update' : 'Create';

    return (
        <Dialog open={open} onClose={onClose} maxWidth={DIALOG_CONFIG.maxWidth} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) => onFieldChange('name', e.target.value)}
                        fullWidth
                        required
                        disabled={isLoading}
                    />
                    
                    <TextField
                        label="SKU"
                        value={formData.sku}
                        onChange={(e) => onFieldChange('sku', e.target.value)}
                        fullWidth
                        required
                        disabled={isLoading}
                    />
                    
                    <TextField
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => onFieldChange('price', parseFloat(e.target.value))}
                        fullWidth
                        required
                        disabled={isLoading}
                    />
                    
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => onFieldChange('description', e.target.value)}
                        fullWidth
                        multiline
                        rows={DIALOG_CONFIG.descriptionRows}
                        disabled={isLoading}
                    />
                    
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={(e) => onFieldChange('isActive', e.target.checked)}
                                disabled={isLoading}
                            />
                        }
                        label="Active"
                    />
                </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button 
                    onClick={onSubmit} 
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
                >
                    {submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
```

---

### 6. Simplified Page Component (page.tsx)

```typescript
/**
 * Menu Items Page
 * Simple, clean component that only handles rendering
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Plus } from 'lucide-react';
import { DynamicTable, DynamicGrid } from '@/components/shared';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMenuItemsPage } from './useMenuItems';
import { useMenuItemColumns } from './config/columns';
import { useMenuItemActions } from './config/actions';
import { useMenuItemGridItems } from './config/gridItems';
import { MenuItemDialog } from './components/MenuItemDialog';

const MenuItemsPage: React.FC = () => {
    const {
        items,
        stats,
        isLoading,
        form,
        dialog,
        handleCreateOrUpdate,
        handleDelete,
        handleEdit,
        isSaving,
    } = useMenuItemsPage();

    const columns = useMenuItemColumns();
    const actions = useMenuItemActions({ onEdit: handleEdit, onDelete: handleDelete });
    const gridItems = useMenuItemGridItems(stats);

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Menu Items"
                actions={[
                    {
                        label: 'Add Item',
                        icon: <Plus size={20} />,
                        onClick: dialog.openForCreate,
                        variant: 'contained',
                    },
                ]}
            />

            <Box sx={{ mb: 4 }}>
                <DynamicGrid items={gridItems} spacing={3} loading={isLoading} />
            </Box>

            <DynamicTable
                columns={columns}
                data={items}
                actions={actions}
                loading={isLoading}
                rowKey="id"
                enableSearch
                enablePagination
            />

            <MenuItemDialog
                open={dialog.isOpen}
                editingItem={dialog.editingItem}
                formData={form.formData}
                onFieldChange={form.updateField}
                onSubmit={handleCreateOrUpdate}
                onClose={() => {
                    dialog.close();
                    form.resetForm();
                }}
                isLoading={isSaving}
            />
        </Box>
    );
};

export default MenuItemsPage;
```

---

## 📋 Checklist for Each Page

Use this checklist when refactoring a page:

### Planning Phase
- [ ] Identify all state variables
- [ ] List all API calls
- [ ] Map out user actions
- [ ] Define form data structure
- [ ] Plan computed values

### Implementation Phase
- [ ] Create `use[PageName].ts` hook
- [ ] Extract form management to sub-hook
- [ ] Extract dialog state to sub-hook
- [ ] Create `config/columns.tsx`
- [ ] Create `config/actions.tsx`
- [ ] Create `config/gridItems.tsx`
- [ ] Create `components/[Name]Dialog.tsx`
- [ ] Simplify page component

### Quality Phase
- [ ] Remove all magic numbers
- [ ] Remove all magic strings
- [ ] Add TypeScript types everywhere
- [ ] Add JSDoc comments
- [ ] Ensure memoization
- [ ] Check for proper error handling
- [ ] Verify loading states

### Testing Phase
- [ ] Write test data factories
- [ ] Write rendering tests
- [ ] Write data loading tests
- [ ] Write CRUD operation tests
- [ ] Write parameterized tests

---

## 🔄 Migration Order

Recommended order for migrating pages:

1. **Menu Items** (straightforward CRUD)
2. **Order Takers** (similar to menu items)
3. **Chefs** (similar to order takers)
4. **Orders** (more complex, has relationships)
5. **Dashboard** (aggregates from other pages)

---

## 💡 Tips & Best Practices

### 1. Start Small
Don't try to refactor everything at once. Start with one page.

### 2. Keep Original Files
Create new files alongside old ones until you're confident.

### 3. Test As You Go
Write tests for new code immediately.

### 4. Copy Templates
Use the templates provided - don't reinvent the wheel.

### 5. Consistent Naming
- Hooks: `use[Feature]` (e.g., `useMenuItems`)
- Configs: `use[Feature][Type]` (e.g., `useMenuItemColumns`)
- Components: `[Feature]Dialog` (e.g., `MenuItemDialog`)

### 6. Extract Constants First
Before refactoring logic, extract all magic numbers and strings.

### 7. One Responsibility
Each function/hook should do ONE thing well.

---

## 🚨 Common Pitfalls

### ❌ Don't Do This:
```typescript
// Too much logic in component
const MenuPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [sku, setSku] = useState('');
    // 20 more useState...
    
    const handleSubmit = () => {
        // 50 lines of logic
    };
    
    return <div>...</div>;
};
```

### ✅ Do This Instead:
```typescript
// Clean separation
const MenuPage = () => {
    const logic = useMenuItemsPage();
    const columns = useMenuItemColumns();
    
    return (
        <DynamicTable 
            columns={columns} 
            data={logic.items} 
        />
    );
};
```

---

## 📞 Need Help?

Refer to:
- `CLEAN_CODE_GUIDE.md` - Comprehensive principles
- `src/app/dashboard/article/*` - Reference implementation
- `src/test/utils.tsx` - Test utilities
- `src/test/constants.ts` - Test constants

---

**Remember: The goal is maintainability, not perfection. Clean code is a journey, not a destination.**

# Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Development
npm run dev          # Start dev server
npm test            # Run tests
npm run build       # Build for production
npm run lint        # Run linter
```

## 📁 File Locations Quick Reference

```
Important Files:
├── API Configuration
│   └── src/app/store/api/baseApi.ts
│
├── Type Definitions
│   └── src/app/store/api/types.ts
│
├── Reusable Components
│   ├── src/components/shared/DynamicTable.tsx
│   ├── src/components/shared/DynamicCard.tsx
│   └── src/components/shared/DynamicGrid.tsx
│
├── Dashboard Pages
│   ├── src/app/dashboard/page.tsx
│   ├── src/app/dashboard/MenuItem/page.tsx
│   ├── src/app/dashboard/Order_Taker/page.tsx
│   ├── src/app/dashboard/Chef/page.tsx
│   └── src/app/dashboard/article/page.tsx
│
└── Documentation
    ├── ARCHITECTURE.md
    ├── README_IMPLEMENTATION.md
    └── IMPLEMENTATION_SUMMARY.md
```

## 🔧 Common Tasks

### Adding a New Resource

```typescript
// 1. Add types (src/app/store/api/types.ts)
export interface Supplier {
  id: number;
  name: string;
  contact: string;
}

// 2. Create API (src/app/store/api/suppliersApi.ts)
export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<Supplier[], void>({
      query: () => '/suppliers',
      providesTags: ['Suppliers'],
    }),
    createSupplier: builder.mutation<Supplier, Partial<Supplier>>({
      query: (body) => ({
        url: '/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suppliers'],
    }),
  }),
});

export const { useGetAllSuppliersQuery, useCreateSupplierMutation } = suppliersApi;

// 3. Export (src/app/store/api/index.ts)
export * from './suppliersApi';

// 4. Update store tags (src/app/store/api/baseApi.ts)
tagTypes: [..., 'Suppliers'],

// 5. Create page (src/app/dashboard/suppliers/page.tsx)
const SuppliersPage = () => {
  const { data = [] } = useGetAllSuppliersQuery();
  const columns: Column<Supplier>[] = [...];
  return <DynamicTable columns={columns} data={data} rowKey="id" />;
};
```

### Using DynamicTable

```typescript
// Define columns
const columns: Column<YourType>[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name', minWidth: 170 },
  { 
    id: 'price', 
    label: 'Price',
    align: 'right',
    format: (value) => `$${value.toFixed(2)}`
  },
];

// Define actions
const actions: TableAction<YourType>[] = [
  {
    icon: <Edit size={18} />,
    label: 'Edit',
    onClick: (row) => handleEdit(row),
    color: 'primary',
  },
  {
    icon: <Trash2 size={18} />,
    label: 'Delete',
    onClick: async (row) => {
      if (confirm('Delete?')) await deleteItem(row.id);
    },
    color: 'error',
  },
];

// Use component
<DynamicTable
  columns={columns}
  data={items}
  actions={actions}
  rowKey="id"
  enableSearch
  enablePagination
  initialRowsPerPage={10}
/>
```

### Using DynamicCard

```typescript
// Simple card
<DynamicCard
  title="Total Items"
  value={150}
  subtitle="All time"
  color="primary"
/>

// Card with trend
<DynamicCard
  title="Revenue"
  value="$12,450"
  color="success"
  variant="gradient"
  icon={<DollarSign size={28} />}
  trend={{
    value: 12.5,
    isPositive: true,
    label: 'vs last month'
  }}
/>

// Card with progress
<DynamicCard
  title="Orders"
  value={75}
  progress={{
    value: 75,
    max: 100,
    label: 'Completion'
  }}
/>
```

### Using DynamicGrid

```typescript
const items: GridItem[] = [
  {
    id: '1',
    xs: 12,    // Full width on mobile
    sm: 6,     // Half width on tablet
    md: 4,     // Third width on desktop
    lg: 3,     // Quarter width on large screens
    content: <DynamicCard {...props} />
  },
];

<DynamicGrid 
  items={items} 
  spacing={3}
  loading={isLoading}
  error={error}
/>
```

## 🎯 RTK Query Patterns

### Query Hook (GET)
```typescript
const { 
  data,           // The data
  isLoading,      // Loading state
  isFetching,     // Background refetching
  error,          // Error if any
  refetch,        // Manual refetch function
} = useGetAllItemsQuery();
```

### Mutation Hook (POST/PUT/DELETE)
```typescript
const [
  createItem,     // Trigger function
  { 
    isLoading,    // Loading state
    error,        // Error if any
    data,         // Response data
  }
] = useCreateItemMutation();

// Usage
try {
  const result = await createItem(payload).unwrap();
  console.log('Success:', result);
} catch (error) {
  console.error('Failed:', error);
}
```

## 🧪 Testing Patterns

### Component Test Template
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';

test('should do something when user does action', () => {
  // Arrange - Setup test data
  const testData = createTestItem({ name: 'Test' });
  
  // Act - Perform action
  renderWithProviders(<Component data={testData} />);
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  
  // Assert - Verify result
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### API Mock Template
```typescript
import { mockApiResponse, mockApiError } from '@/test/utils';

test('should display data on successful fetch', async () => {
  // Mock API response
  mockApiResponse('/api/items', [{ id: 1, name: 'Test' }]);
  
  renderWithProviders(<ItemsPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

test('should show error on failed fetch', async () => {
  mockApiError('Network error');
  
  renderWithProviders(<ItemsPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
```

## 📊 TypeScript Patterns

### Type-Safe Column Definition
```typescript
interface Item {
  id: number;
  name: string;
  price: number;
}

const columns: Column<Item>[] = [
  { id: 'id', label: 'ID' },        // ✅ Type-safe
  { id: 'name', label: 'Name' },    // ✅ Type-safe
  { id: 'invalid', label: 'Err' },  // ❌ TypeScript error
];
```

### Type-Safe API Hooks
```typescript
// Query returns typed data
const { data } = useGetAllMenuItemsQuery();
// data is MenuItem[] | undefined

// Mutation accepts typed input
const [create] = useCreateMenuItemMutation();
create({ name: 'Pizza', price: 12.99 }); // ✅ Type-safe
create({ invalid: 'data' });              // ❌ TypeScript error
```

## 🎨 Styling Patterns

### MUI sx Prop
```typescript
<Box sx={{
  p: 3,                    // padding: 24px
  mb: 2,                   // marginBottom: 16px
  display: 'flex',
  gap: 2,
  backgroundColor: (theme) => 
    alpha(theme.palette.primary.main, 0.1),
}}>
```

### Responsive Design
```typescript
<Grid item 
  xs={12}  // Full width mobile
  sm={6}   // Half width tablet
  md={4}   // Third width desktop
  lg={3}   // Quarter width large
>
```

## 🔐 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# For production
NEXT_PUBLIC_API_URL=https://api.production.com/api
```

## 📋 Code Quality Checklist

Before committing:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Tests pass
- [ ] Components properly typed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Empty states considered
- [ ] Responsive design verified

## 🎓 Key Concepts

### SOLID Quick Reference
- **S** - One purpose per component
- **O** - Extend via props, not modification
- **L** - Generic types enable substitution
- **I** - Small, focused interfaces
- **D** - Depend on abstractions (hooks)

### Clean Testing Quick Reference
- Descriptive names (what/when/then)
- Arrange/Act/Assert structure
- No logic (if/for/while)
- One behavior per test
- Meaningful test data
- Deterministic results

## 🚨 Common Issues & Solutions

### Issue: "Module not found"
```bash
# Solution: Install dependencies
npm install
```

### Issue: API calls fail
```bash
# Solution: Check .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Issue: Type errors
```typescript
// Solution: Ensure types match Prisma schema
// Check: src/app/store/api/types.ts
```

### Issue: Redux state not updating
```typescript
// Solution: Invalidate tags in mutation
invalidatesTags: ['YourTag']
```

## 📚 Documentation Links

- **Architecture**: `ARCHITECTURE.md`
- **Implementation**: `README_IMPLEMENTATION.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **RTK Query Docs**: https://redux-toolkit.js.org/rtk-query/overview
- **Material-UI**: https://mui.com/

## 🎯 Performance Tips

1. **useMemo** for expensive calculations
2. **useCallback** for event handlers
3. **React.memo** for expensive renders
4. RTK Query handles caching automatically
5. Use pagination for large datasets

## 🔄 Git Workflow

```bash
# Feature branch
git checkout -b feature/your-feature

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Before merging
npm test              # Run tests
npm run build         # Verify build
npm run lint          # Check linting

# Merge
git checkout main
git merge feature/your-feature
```

---

**Quick Reference Version 1.0**
*Last Updated: January 2024*

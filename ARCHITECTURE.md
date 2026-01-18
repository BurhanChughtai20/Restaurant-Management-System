# Restaurant Management System - Frontend Architecture

## Overview
This document outlines the clean, scalable architecture implemented for the Restaurant Management System admin dashboard.

## Core Principles Applied

### SOLID Principles

#### Single Responsibility Principle (SRP)
- Each component has one clear purpose
- `DynamicTable`: Only handles table rendering logic
- `DynamicCard`: Only handles card display
- `DynamicGrid`: Only handles grid layout
- API slices: Each handles one resource type

#### Open/Closed Principle (OCP)
- Components are open for extension via props but closed for modification
- New table columns can be added without changing the component
- New card variants can be added via the `variant` prop

#### Liskov Substitution Principle (LSP)
- Generic types ensure type safety across all data types
- `DynamicTable<T>` can accept any data type that conforms to the interface

#### Interface Segregation Principle (ISP)
- Props interfaces are specific and not bloated
- Optional props allow flexibility without forcing unused features
- `TableAction`, `Column`, `GridItem` interfaces are minimal

#### Dependency Inversion Principle (DIP)
- Components depend on abstractions (props interfaces) not concrete implementations
- RTK Query abstracts API details from components
- Components consume data via hooks, not direct API calls

### Other Core Principles

#### DRY (Don't Repeat Yourself)
- Reusable components eliminate code duplication
- Centralized API configuration
- Shared types across the application

#### KISS (Keep It Simple, Stupid)
- Components have clear, simple APIs
- No unnecessary complexity
- Straightforward data flow

#### YAGNI (You Aren't Gonna Need It)
- Only implemented features currently needed
- No speculative features

#### Tell, Don't Ask
- Components encapsulate their own logic
- External code doesn't need to know implementation details

#### Composition Over Inheritance
- Components composed of smaller, reusable pieces
- No complex inheritance hierarchies

## Architecture Layers

### 1. Data Layer (`src/app/store`)

#### RTK Query API (`src/app/store/api/`)
- **baseApi.ts**: Centralized API configuration with authentication
- **types.ts**: TypeScript interfaces matching Prisma schema
- **menuItemsApi.ts**: Menu items CRUD operations
- **orderTakersApi.ts**: Waiter management operations
- **chefsApi.ts**: Chef management operations
- **ordersApi.ts**: Order management and analytics
- **articlesApi.ts**: Content management with AI generation

**Benefits:**
- Automatic caching and invalidation
- Optimistic updates
- Background refetching
- Type-safe API calls
- Centralized error handling

#### Slices (`src/app/store/slices/`)
- **dashboardSlice.ts**: Dashboard state and notifications
- **menuSlice.ts**: Menu navigation state
- **userSlice.ts**: User authentication state

### 2. Presentation Layer (`src/components/shared`)

#### DynamicTable Component
**Features:**
- Generic type-safe implementation
- Sorting (ascending/descending)
- Pagination with configurable page sizes
- Search across all columns
- Custom column formatting
- Row actions (edit, delete, view, etc.)
- Loading and error states
- Empty state messaging
- Sticky header option

**Usage Example:**
```typescript
const columns: Column<MenuItem>[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { 
    id: 'price', 
    label: 'Price', 
    align: 'right',
    format: (value) => `$${value.toFixed(2)}` 
  },
];

const actions: TableAction<MenuItem>[] = [
  {
    icon: <Edit />,
    label: 'Edit',
    onClick: (row) => handleEdit(row),
    color: 'primary',
  },
];

<DynamicTable
  columns={columns}
  data={menuItems}
  actions={actions}
  rowKey="id"
/>
```

#### DynamicCard Component
**Features:**
- Multiple variants (default, gradient, outlined)
- Trend indicators with automatic coloring
- Progress bars
- Custom icons
- Various color schemes
- Loading states
- Click handlers

**Variants:**
- **Default**: Subtle background with colored border
- **Gradient**: Full gradient background
- **Outlined**: Transparent with colored border

#### DynamicGrid Component
**Features:**
- Responsive grid layout
- Configurable breakpoints (xs, sm, md, lg, xl)
- Loading, error, and empty states
- Customizable spacing

### 3. Page Layer (`src/app/dashboard/`)

Each dashboard page follows the same clean pattern:

1. **Import hooks and components**
2. **Fetch data using RTK Query hooks**
3. **Calculate derived metrics using useMemo**
4. **Define table columns and actions**
5. **Render stats cards in grid**
6. **Render main data table**
7. **Handle CRUD operations via mutations**

**Example Pages:**
- `dashboard/page.tsx`: Overview with aggregated metrics
- `dashboard/MenuItem/page.tsx`: Menu items management
- `dashboard/Order_Taker/page.tsx`: Waiter management
- `dashboard/Chef/page.tsx`: Chef management
- `dashboard/article/page.tsx`: Content management

## State Management

### Redux Store Configuration
```typescript
store/
├── api/              # RTK Query APIs
│   ├── baseApi.ts    # Base configuration
│   ├── types.ts      # Shared types
│   └── *Api.ts       # Resource-specific APIs
├── slices/           # Redux slices
│   ├── dashboardSlice.ts
│   ├── menuSlice.ts
│   └── userSlice.ts
└── store.ts          # Store configuration
```

### Data Flow
1. Component mounts
2. RTK Query hook triggers API call
3. Data cached in Redux store
4. Component receives data and renders
5. User action triggers mutation
6. Optimistic update in UI
7. API call completes
8. Cache invalidated automatically
9. Related queries refetch

## Component Reusability

### Same Structure, Different Data
All tables use the same `DynamicTable` component with different column configurations:

```typescript
// Menu Items Table
<DynamicTable<MenuItem> columns={menuColumns} data={menuItems} />

// Order Takers Table
<DynamicTable<OrderTaker> columns={waiterColumns} data={waiters} />

// Orders Table
<DynamicTable<Order> columns={orderColumns} data={orders} />
```

### Same Cards, Different Metrics
All stat cards use the same `DynamicCard` component:

```typescript
<DynamicCard
  title="Total Revenue"
  value="$12,450"
  variant="gradient"
  color="success"
  trend={{ value: 12.5, isPositive: true }}
/>
```

## Testing Strategy

### Test Structure (Following Clean Tests Principles)

#### 1. Descriptive Test Names
```typescript
// ❌ Bad
test('table works', () => {});

// ✅ Good
test('should sort menu items by price when price column header is clicked', () => {});
```

#### 2. Given/When/Then Pattern
```typescript
test('should display error message when API request fails', () => {
  // Given: A table component and a failed API response
  const error = 'Network error';
  
  // When: The component renders with error state
  render(<DynamicTable {...props} error={error} />);
  
  // Then: Error message is visible to user
  expect(screen.getByText(error)).toBeInTheDocument();
});
```

#### 3. Arrange/Act/Assert Structure
```typescript
test('should call onClick handler when action button is clicked', () => {
  // Arrange
  const handleClick = jest.fn();
  const actions = [{ icon: <Edit />, label: 'Edit', onClick: handleClick }];
  
  // Act
  render(<DynamicTable {...props} actions={actions} />);
  fireEvent.click(screen.getByLabelText('Edit'));
  
  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 4. No Logic in Tests
```typescript
// ❌ Bad - contains logic
test('validates all items', () => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].active) {
      expect(items[i].status).toBe('active');
    }
  }
});

// ✅ Good - no logic, clear assertions
test('should mark active items with active status', () => {
  const activeItem = { id: 1, active: true, status: 'active' };
  expect(activeItem.status).toBe('active');
});
```

#### 5. One Behavior Per Test
```typescript
// ❌ Bad - tests multiple behaviors
test('table component', () => {
  expect(table.rows).toHaveLength(10);
  expect(table.search).toBeVisible();
  expect(table.pagination).toWork();
});

// ✅ Good - one behavior each
test('should display correct number of rows', () => {
  expect(screen.getAllByRole('row')).toHaveLength(10);
});

test('should show search input', () => {
  expect(screen.getByPlaceholderText('Search...')).toBeVisible();
});
```

#### 6. Meaningful Test Data
```typescript
// ❌ Bad - meaningless data
const item = { id: 1, name: 'xyz', price: 123 };

// ✅ Good - domain-relevant data
const pizzaItem = { 
  id: 1, 
  name: 'Margherita Pizza', 
  price: 12.99,
  category: 'Italian'
};
```

#### 7. Hide Irrelevant Details
```typescript
// ❌ Bad - too many irrelevant details
const menuItem = {
  id: 1,
  name: 'Pizza',
  description: 'Delicious',
  price: 12.99,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
  restaurantId: 5,
  sku: 'PIZZA-001',
  // ... many more fields
};

// ✅ Good - only relevant fields
const menuItem = createMenuItem({ price: 12.99 });
// Helper function handles irrelevant defaults
```

#### 8. Deterministic Tests
```typescript
// ❌ Bad - non-deterministic
test('orders are sorted', () => {
  const orders = getOrders(); // Random order
  expect(orders[0].date).toBeGreaterThan(orders[1].date);
});

// ✅ Good - deterministic
test('orders are sorted by date descending', () => {
  const orders = [
    { id: 1, date: '2024-01-02' },
    { id: 2, date: '2024-01-01' },
  ];
  const sorted = sortOrders(orders);
  expect(sorted[0].date).toBe('2024-01-02');
});
```

#### 9. Parameterized Tests
```typescript
// Instead of repeating tests
test.each([
  { input: 'pizza', expected: ['Margherita', 'Pepperoni'] },
  { input: 'pasta', expected: ['Carbonara', 'Bolognese'] },
  { input: '', expected: [] },
])('should search menu items for "$input"', ({ input, expected }) => {
  const results = searchMenuItems(input);
  expect(results.map(r => r.name)).toEqual(expected);
});
```

### Testing Files Structure
```
__tests__/
├── components/
│   ├── DynamicTable.test.tsx
│   ├── DynamicCard.test.tsx
│   └── DynamicGrid.test.tsx
├── api/
│   ├── menuItemsApi.test.ts
│   ├── orderTakersApi.test.ts
│   └── chefsApi.test.ts
└── pages/
    ├── Dashboard.test.tsx
    └── MenuItem.test.tsx
```

## Code Quality Standards

### Avoid Code Smells

#### 1. Magic Numbers/Strings
```typescript
// ❌ Bad
if (status === 'PENDING') { ... }
if (price > 100) { ... }

// ✅ Good
const ORDER_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;

const PRICE_THRESHOLD = 100;

if (status === ORDER_STATUS.PENDING) { ... }
if (price > PRICE_THRESHOLD) { ... }
```

#### 2. Long Parameter Lists
```typescript
// ❌ Bad
function createOrder(
  customerId: number,
  items: Item[],
  discount: number,
  tax: number,
  shippingAddress: string,
  billingAddress: string,
  paymentMethod: string
) { ... }

// ✅ Good
interface CreateOrderParams {
  customerId: number;
  items: Item[];
  pricing: {
    discount: number;
    tax: number;
  };
  addresses: {
    shipping: string;
    billing: string;
  };
  paymentMethod: string;
}

function createOrder(params: CreateOrderParams) { ... }
```

#### 3. Deep Nesting
```typescript
// ❌ Bad
if (user) {
  if (user.isActive) {
    if (user.role === 'admin') {
      if (user.permissions.includes('delete')) {
        // delete logic
      }
    }
  }
}

// ✅ Good
const canDelete = 
  user?.isActive &&
  user?.role === 'admin' &&
  user?.permissions.includes('delete');

if (!canDelete) return;
// delete logic
```

#### 4. Primitive Obsession
```typescript
// ❌ Bad - using primitives everywhere
function calculatePrice(
  basePrice: number,
  discount: number,
  tax: number
): number { ... }

// ✅ Good - rich domain types
class Money {
  constructor(private amount: number) {}
  
  add(other: Money): Money { ... }
  multiply(factor: number): Money { ... }
  format(): string { ... }
}

class Price {
  constructor(
    private base: Money,
    private discount: Money,
    private tax: Money
  ) {}
  
  total(): Money { ... }
}
```

### Formatting Standards

1. **Prettier** for automatic formatting
2. **ESLint** for code quality
3. **Max line width**: 100 characters
4. **Indentation**: 2 spaces
5. **Variables declared close to usage**
6. **Consistent import ordering**

## Performance Optimizations

### 1. Memoization
```typescript
const stats = React.useMemo(() => {
  return {
    total: menuItems.length,
    active: menuItems.filter(i => i.isActive).length,
  };
}, [menuItems]);
```

### 2. RTK Query Caching
- Automatic data caching
- Background refetching
- Optimistic updates
- Cache invalidation strategies

### 3. Component Optimization
- Lazy loading for routes
- Code splitting
- Virtualization for large lists (future enhancement)

## Scalability Considerations

### Adding New Resources
To add a new resource (e.g., "Suppliers"):

1. **Define types** in `api/types.ts`
2. **Create API slice** in `api/suppliersApi.ts`
3. **Export from** `api/index.ts`
4. **Create page** `dashboard/suppliers/page.tsx`
5. **Add route** to `menuConfig.tsx`
6. **Use existing components** (DynamicTable, DynamicCard, DynamicGrid)

### Extending Components
Components accept render props and custom formatters for flexibility:

```typescript
<DynamicTable
  columns={[
    {
      id: 'custom',
      label: 'Custom',
      format: (value, row) => <CustomComponent data={row} />
    }
  ]}
/>
```

## Environment Configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Best Practices Summary

### Do ✅
- Use TypeScript for type safety
- Follow SOLID principles
- Keep components small and focused
- Use RTK Query for API calls
- Memoize expensive calculations
- Write descriptive test names
- Keep tests deterministic
- Use meaningful test data

### Don't ❌
- Mix concerns in components
- Duplicate code across pages
- Use direct API calls in components
- Include logic in tests
- Use magic numbers/strings
- Create deep nesting
- Ignore TypeScript errors
- Write non-deterministic tests

## Monitoring and Debugging

### Redux DevTools
- Inspect state changes
- Time-travel debugging
- Action replay

### RTK Query DevTools
- View cached data
- Monitor API calls
- Track loading states

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live order updates
2. **Advanced Analytics**: Charts and graphs using recharts
3. **Bulk Operations**: Multi-select and batch actions
4. **Export Functionality**: CSV/Excel export
5. **Advanced Filtering**: Complex filter combinations
6. **Virtualization**: For very large datasets
7. **Offline Support**: PWA capabilities
8. **Role-based Access**: Granular permissions

## Conclusion

This architecture provides:
- **Maintainability**: Clear structure and separation of concerns
- **Scalability**: Easy to add new features and resources
- **Testability**: Clean, testable code following best practices
- **Performance**: Optimized data fetching and caching
- **Type Safety**: Full TypeScript coverage
- **Developer Experience**: Excellent DX with Redux DevTools and TypeScript

The implementation follows industry best practices and is production-ready for a fast, reliable, and scalable restaurant management system.

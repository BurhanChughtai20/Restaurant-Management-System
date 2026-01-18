# Restaurant Management System - Frontend Admin Dashboard

## 🎯 Project Overview

A modern, scalable admin dashboard for restaurant management built with **Next.js 14**, **TypeScript**, **Redux Toolkit (RTK Query)**, and **Material-UI**. This implementation follows **SOLID principles**, **clean code practices**, and **clean testing methodologies**.

## ✨ Key Features

### Implemented Modules
- ✅ **Menu Items Management** - Full CRUD operations with dynamic table
- ✅ **Order Takers (Waiters)** - Staff management with QR token generation
- ✅ **Chefs Management** - Kitchen staff tracking with schedules
- ✅ **Orders Dashboard** - Real-time order tracking and analytics
- ✅ **Articles/Blog** - Content management with AI auto-generation
- ✅ **Dashboard Overview** - Aggregated metrics and insights

### Core Components
- 🔄 **DynamicTable** - Fully reusable data table with sorting, pagination, search
- 📊 **DynamicCard** - Versatile stats cards with trends and progress bars
- 📐 **DynamicGrid** - Responsive grid layout system

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Framework**: Material-UI (MUI)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

### Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── MenuItem/        # Menu items page
│   │   │   ├── Order_Taker/     # Waiters page
│   │   │   ├── Chef/            # Chefs page
│   │   │   ├── article/         # Articles page
│   │   │   └── page.tsx         # Dashboard overview
│   │   └── store/               # Redux store
│   │       ├── api/             # RTK Query APIs
│   │       │   ├── baseApi.ts
│   │       │   ├── types.ts
│   │       │   ├── menuItemsApi.ts
│   │       │   ├── orderTakersApi.ts
│   │       │   ├── chefsApi.ts
│   │       │   ├── ordersApi.ts
│   │       │   └── articlesApi.ts
│   │       ├── slices/          # Redux slices
│   │       └── store.ts
│   ├── components/
│   │   ├── shared/              # Reusable components
│   │   │   ├── DynamicTable.tsx
│   │   │   ├── DynamicCard.tsx
│   │   │   └── DynamicGrid.tsx
│   │   └── admin-dashboard/     # Dashboard-specific components
│   ├── test/
│   │   └── utils.tsx            # Testing utilities
│   └── __tests__/
│       └── components/          # Component tests
└── ARCHITECTURE.md              # Detailed architecture docs
```

## 🎨 Design Patterns & Principles

### SOLID Principles

#### Single Responsibility Principle (SRP) ✅
Each component has **one clear responsibility**:
- `DynamicTable` → Data table rendering
- `DynamicCard` → Stats card display  
- `menuItemsApi` → Menu items API calls only
- Each page → One resource management

#### Open/Closed Principle (OCP) ✅
Components are **open for extension**, **closed for modification**:
```typescript
// Extend via props, don't modify component
<DynamicTable
  columns={customColumns}
  actions={customActions}
  format={customFormatter}
/>
```

#### Liskov Substitution Principle (LSP) ✅
Generic types ensure **type safety**:
```typescript
DynamicTable<MenuItem> // Works with any type
DynamicTable<Order>
DynamicTable<Chef>
```

#### Interface Segregation Principle (ISP) ✅
**Small, focused interfaces**:
```typescript
interface Column<T> { ... }      // Only column concerns
interface TableAction<T> { ... } // Only action concerns
interface GridItem { ... }       // Only grid concerns
```

#### Dependency Inversion Principle (DIP) ✅
Components **depend on abstractions**:
```typescript
// Components use hooks, not direct API calls
const { data } = useGetAllMenuItemsQuery(); // ✅
// Not: const data = await fetch('/api/menu'); // ❌
```

### Other Principles

- **DRY** - No code duplication, reusable components
- **KISS** - Simple, clear APIs
- **YAGNI** - Only implemented needed features
- **Composition over Inheritance** - Components composed, not inherited

## 🧪 Testing Strategy

### Clean Testing Principles Applied

✅ **Descriptive test names**
```typescript
test('should sort menu items by price when price column header is clicked')
```

✅ **Given/When/Then pattern**
```typescript
// Given: Data and expected state
// When: User action
// Then: Expected result
```

✅ **Arrange/Act/Assert structure**
```typescript
test('example', () => {
  // Arrange - Setup
  // Act - Execute
  // Assert - Verify
});
```

✅ **No logic in tests** - No if/for/while
✅ **One behavior per test**
✅ **Meaningful test data** - Domain-relevant
✅ **Deterministic tests** - Always same results
✅ **Parameterized tests** - test.each()

### Test Utilities
```typescript
// Factory functions hide irrelevant details
createMenuItem({ price: 12.99 })
createOrderTaker({ name: 'John' })

// Redux testing helpers
renderWithProviders(<Component />)

// API mocking
mockApiResponse('endpoint', data)
mockApiError('message')
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running

### Installation

1. **Clone and install**
```bash
cd frontend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. **Run development server**
```bash
npm run dev
```

4. **Run tests**
```bash
npm test
```

5. **Build for production**
```bash
npm run build
```

## 📊 Component Usage Examples

### DynamicTable
```typescript
const columns: Column<MenuItem>[] = [
  { id: 'name', label: 'Name' },
  { 
    id: 'price', 
    label: 'Price',
    format: (value) => `$${value.toFixed(2)}`
  },
];

const actions: TableAction<MenuItem>[] = [
  {
    icon: <Edit />,
    label: 'Edit',
    onClick: (row) => handleEdit(row),
  },
];

<DynamicTable
  columns={columns}
  data={menuItems}
  actions={actions}
  rowKey="id"
  enableSearch
  enablePagination
/>
```

### DynamicCard
```typescript
<DynamicCard
  title="Total Revenue"
  value="$12,450"
  subtitle="This month"
  color="success"
  variant="gradient"
  icon={<DollarSign />}
  trend={{
    value: 12.5,
    isPositive: true,
    label: 'vs last month'
  }}
/>
```

### DynamicGrid
```typescript
const items: GridItem[] = [
  {
    id: 'card1',
    xs: 12,
    md: 6,
    lg: 4,
    content: <DynamicCard {...cardProps} />
  },
];

<DynamicGrid items={items} spacing={3} />
```

## 🔌 API Integration

### RTK Query Hooks
```typescript
// Query hooks (GET)
const { data, isLoading, error } = useGetAllMenuItemsQuery();
const { data } = useGetOrderTakerStatsQuery();

// Mutation hooks (POST/PUT/DELETE)
const [createMenuItem] = useCreateMenuItemMutation();
const [updateMenuItem] = useUpdateMenuItemMutation();
const [deleteMenuItem] = useDeleteMenuItemMutation();

// Usage
await createMenuItem({ name: 'Pizza', price: 12.99 });
```

### Available APIs
- `menuItemsApi` - Menu CRUD, search, pagination
- `orderTakersApi` - Waiter management, QR tokens
- `chefsApi` - Chef management, schedules
- `ordersApi` - Orders, analytics
- `articlesApi` - Content management, AI generation

## 📝 Backend Integration

### API Endpoints Mapped
```
Backend                          Frontend Hook
---------------------------------------------------------
GET    /menu-items/admin         useGetAllMenuItemsQuery()
POST   /menu-items/admin/...     useCreateMenuItemMutation()
GET    /waiter                   useGetAllOrderTakersQuery()
GET    /chef                     useGetAllChefsQuery()
GET    /orders/admin             useGetAllOrdersQuery()
GET    /article                  useGetArticlesQuery()
```

### Prisma Schema Aligned
All TypeScript types in `api/types.ts` match Prisma models:
- MenuItem
- OrderTaker / WaiterConnection
- Chef / ChefConnection
- Order / OrderItem
- Article
- WhatsAppOrder

## 🎯 Code Quality

### No Code Smells ✅
- ❌ Magic numbers → ✅ Named constants
- ❌ Long parameter lists → ✅ Interface parameters
- ❌ Deep nesting → ✅ Early returns
- ❌ Primitive obsession → ✅ Rich types

### Formatting Standards
- **Prettier** for auto-formatting
- **ESLint** for code quality
- **Max line width**: 100 characters
- **Indentation**: 2 spaces

## 📚 Documentation

- **ARCHITECTURE.md** - Detailed architecture guide
- **Inline comments** - Component documentation
- **Type definitions** - Full TypeScript coverage

## 🔐 Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional (for production)
# NEXT_PUBLIC_API_URL=https://api.yourrestaurant.com/api
```

## 🛠️ Development Workflow

### Adding New Resource
1. Define types in `api/types.ts`
2. Create API slice `api/resourceApi.ts`
3. Export from `api/index.ts`
4. Create page `dashboard/resource/page.tsx`
5. Add to menu config
6. Use existing components (zero new UI code needed!)

### Example: Adding Suppliers
```typescript
// 1. types.ts
export interface Supplier {
  id: number;
  name: string;
  contact: string;
}

// 2. suppliersApi.ts
export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<Supplier[], void>({
      query: () => '/suppliers',
    }),
  }),
});

// 3. page.tsx
const SuppliersPage = () => {
  const { data } = useGetAllSuppliersQuery();
  return <DynamicTable columns={...} data={data} />;
};
```

## 📈 Performance Optimizations

- ✅ **Automatic caching** via RTK Query
- ✅ **Optimistic updates** for instant UI feedback
- ✅ **useMemo** for expensive calculations
- ✅ **Code splitting** with Next.js dynamic imports
- ✅ **Background refetching** for fresh data

## 🔮 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Charts and analytics (recharts)
- [ ] Bulk operations (multi-select)
- [ ] CSV/Excel export
- [ ] Advanced filtering
- [ ] Virtual scrolling for large datasets
- [ ] PWA support
- [ ] Role-based access control

## 🤝 Contributing

This project follows:
- **SOLID** principles
- **Clean Code** practices
- **Clean Testing** methodologies
- **TypeScript** strict mode
- **ESLint** + **Prettier** standards

## 📄 License

[Your License]

## 👨‍💻 Author

[Your Name]

---

## 🎓 Learning Resources

For more on the principles applied:
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

---

**Built with ❤️ following best practices in software engineering**

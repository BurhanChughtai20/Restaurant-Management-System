# Cache Invalidation Examples for CRUD Operations

This file provides ready-to-use examples for cache invalidation in create, update, and delete operations.

## 🧹 Chef Management - Cache Invalidation Examples

### Create Chef with Cache Invalidation
```typescript
// src/controller/staff/chef/createChef.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function createChef(chefData: {
  name: string;
  email: string;
  restaurantId: number;
}) {
  // Create new chef
  const newChef = await prisma.chefConnection.create({
    data: {
      chef: {
        create: chefData
      }
    },
    include: {
      chef: true
    }
  });

  // Clear all chef-related caches
  await invalidateCacheByPattern("search:chefs:*");
  await invalidateCacheByPattern("paginate:chefs:*");

  return newChef;
}
```

### Update Chef with Cache Invalidation
```typescript
// src/controller/staff/chef/updateChef.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function updateChef(
  chefId: number,
  updateData: {
    name?: string;
    email?: string;
  }
) {
  // Update chef
  const updatedChef = await prisma.chefConnection.update({
    where: { chefId },
    data: {
      chef: {
        update: updateData
      }
    },
    include: {
      chef: true
    }
  });

  // Clear all chef-related caches to fetch fresh data
  await invalidateCacheByPattern("search:chefs:*");
  await invalidateCacheByPattern("paginate:chefs:*");

  return updatedChef;
}
```

### Delete Chef with Cache Invalidation
```typescript
// src/controller/staff/chef/deleteChef.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function deleteChef(chefId: number) {
  // Delete chef
  await prisma.chefConnection.delete({
    where: { chefId }
  });

  // Clear all chef-related caches
  await invalidateCacheByPattern("search:chefs:*");
  await invalidateCacheByPattern("paginate:chefs:*");
}
```

---

## 🧹 Menu Items - Cache Invalidation Examples

### Create Menu Item with Cache Invalidation
```typescript
// src/controller/menu-itms/admin/createMenuItem.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function createMenuItem(menuItemData: {
  name: string;
  description: string;
  price: number;
  restaurantId: number;
}) {
  // Create new menu item
  const newItem = await prisma.menuItem.create({
    data: menuItemData
  });

  // Clear menu item caches
  await invalidateCacheByPattern("search:menu_items:*");
  await invalidateCacheByPattern("paginate:menu_items:*");

  return newItem;
}
```

### Update Menu Item with Cache Invalidation
```typescript
// src/controller/menu-itms/admin/updateMenuItem.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function updateMenuItem(
  itemId: number,
  updateData: {
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
  }
) {
  // Update menu item
  const updatedItem = await prisma.menuItem.update({
    where: { id: itemId },
    data: updateData
  });

  // Clear menu item caches
  await invalidateCacheByPattern("search:menu_items:*");
  await invalidateCacheByPattern("paginate:menu_items:*");

  return updatedItem;
}
```

### Delete Menu Item with Cache Invalidation
```typescript
// src/controller/menu-itms/admin/deleteMenuItem.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function deleteMenuItem(itemId: number) {
  // Delete menu item
  await prisma.menuItem.delete({
    where: { id: itemId }
  });

  // Clear menu item caches
  await invalidateCacheByPattern("search:menu_items:*");
  await invalidateCacheByPattern("paginate:menu_items:*");
}
```

---

## 🧹 Waiter/Order Taker - Cache Invalidation Examples

### Create Waiter with Cache Invalidation
```typescript
// src/controller/staff/order_taker/createWaiter.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function createWaiter(waiterData: {
  name: string;
  email: string;
  restaurantId: number;
}) {
  // Create new waiter
  const newWaiter = await prisma.waiterConnection.create({
    data: {
      waiter: {
        create: waiterData
      }
    },
    include: {
      waiter: true
    }
  });

  // Clear waiter caches
  await invalidateCacheByPattern("search:waiters:*");
  await invalidateCacheByPattern("paginate:waiters:*");

  return newWaiter;
}
```

### Update Waiter with Cache Invalidation
```typescript
// src/controller/staff/order_taker/updateWaiter.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function updateWaiter(
  waiterId: number,
  updateData: {
    name?: string;
    email?: string;
  }
) {
  // Update waiter
  const updatedWaiter = await prisma.waiterConnection.update({
    where: { orderTakerId: waiterId },
    data: {
      waiter: {
        update: updateData
      }
    },
    include: {
      waiter: true
    }
  });

  // Clear waiter caches
  await invalidateCacheByPattern("search:waiters:*");
  await invalidateCacheByPattern("paginate:waiters:*");

  return updatedWaiter;
}
```

### Delete Waiter with Cache Invalidation
```typescript
// src/controller/staff/order_taker/deleteWaiter.ts
import { invalidateCacheByPattern } from "../../../libs/redisCache.ts";
import prisma from "../../../libs/prisma.ts";

export async function deleteWaiter(waiterId: number) {
  // Delete waiter
  await prisma.waiterConnection.delete({
    where: { orderTakerId: waiterId }
  });

  // Clear waiter caches
  await invalidateCacheByPattern("search:waiters:*");
  await invalidateCacheByPattern("paginate:waiters:*");
}
```

---

## 🧹 Articles - Cache Invalidation Examples

### Create Article with Cache Invalidation
```typescript
// src/controller/article/createArticle.ts
import { invalidateCacheByPattern } from "../../libs/redisCache.ts";
import prisma from "../../libs/prisma.ts";

export async function createArticle(articleData: {
  title: string;
  description: string;
  content: string;
  publisherId: number;
  restaurantName: string;
}) {
  // Create new article
  const newArticle = await prisma.article.create({
    data: articleData,
    include: {
      publisher: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  // Clear article cache
  await invalidateCacheByPattern("search:articles:*");

  return newArticle;
}
```

### Update Article with Cache Invalidation
```typescript
// src/controller/article/updateArticle.ts
import { invalidateCacheByPattern } from "../../libs/redisCache.ts";
import prisma from "../../libs/prisma.ts";

export async function updateArticle(
  articleId: number,
  updateData: {
    title?: string;
    description?: string;
    content?: string;
  }
) {
  // Update article
  const updatedArticle = await prisma.article.update({
    where: { id: articleId },
    data: updateData,
    include: {
      publisher: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  // Clear article cache
  await invalidateCacheByPattern("search:articles:*");

  return updatedArticle;
}
```

### Delete Article with Cache Invalidation
```typescript
// src/controller/article/deleteArticle.ts
import { invalidateCacheByPattern } from "../../libs/redisCache.ts";
import prisma from "../../libs/prisma.ts";

export async function deleteArticle(articleId: number) {
  // Delete article
  await prisma.article.delete({
    where: { id: articleId }
  });

  // Clear article cache
  await invalidateCacheByPattern("search:articles:*");
}
```

---

## 🔄 Pattern Reference

### Cache Keys by Entity
```
Chef Search:          search:chefs:*
Chef Pagination:      paginate:chefs:*

Waiter Search:        search:waiters:*
Waiter Pagination:    paginate:waiters:*

Menu Items Search:    search:menu_items:*
Menu Items Paging:    paginate:menu_items:*

Articles Search:      search:articles:*
```

### Standard Invalidation Pattern
```typescript
// Always invalidate BOTH search and pagination caches
await invalidateCacheByPattern("search:entity:*");
await invalidateCacheByPattern("paginate:entity:*");
```

### Bulk Operations
```typescript
// If updating multiple items, clear all at once
export async function bulkUpdateChefs(updates: Array<{id: number; data: any}>) {
  // Perform updates...
  
  // Single cache clear for all updates
  await invalidateCacheByPattern("search:chefs:*");
  await invalidateCacheByPattern("paginate:chefs:*");
}
```

---

## 🚨 Important Notes

1. **Always clear cache after mutations**: Create, update, and delete operations should invalidate related caches
2. **Use patterns for bulk operations**: `invalidateCacheByPattern()` is efficient for clearing multiple entries
3. **Cache is automatic for reads**: Search and pagination functions automatically cache - no manual setup needed
4. **Selective invalidation**: Only clear caches related to modified data
5. **No cache for mutations**: POST, PUT, DELETE requests don't use caching (by design)

---

## ✅ Checklist for CRUD Implementation

When implementing create/update/delete functions:

- [ ] Function creates/updates/deletes data successfully
- [ ] Function returns the modified data
- [ ] Function invalidates related search caches
- [ ] Function invalidates related pagination caches
- [ ] Error handling is in place
- [ ] Response includes proper status codes

---

## 📊 Cache Invalidation Flow

```
User Action (Create/Update/Delete)
    ↓
Execute Database Operation
    ↓
Call invalidateCacheByPattern()
    ↓
Clear related Redis entries
    ↓
Return response to client
    ↓
Next request gets fresh data ✓
```

---

Version: 1.0 | Last Updated: January 3, 2026

## WhatsApp Bot Implementation Guide

### Overview

The WhatsApp Bot provides a conversational interface for restaurant clients with the following features:
- 🔐 Restaurant isolation at all layers (middleware, controller, database)
- 🤖 RAG-powered responses using Pinecone vector database
- 📦 Order management with full lifecycle tracking
- 📱 Client messaging and order placement

### Architecture

#### Three-Layer Security Model

1. **Middleware Layer** (`restaurantAuth`)
   - Validates JWT token
   - Extracts `restaurantId` from token
   - Injects into request object

2. **Controller Layer**
   - Receives `restaurantId` from middleware
   - Validates user/item/order ownership
   - Ensures all database queries filter by `restaurantId`

3. **Database Layer**
   - All WhatsApp tables include `restaurantId` foreign key
   - Unique constraints enforce restaurant isolation
   - Cascading deletes maintain referential integrity

### Database Schema

#### WhatsAppNumber (Admin-Controlled)
```typescript
model WhatsAppNumber {
  id           Int      @id @default(autoincrement())
  restaurantId Int      // Link to restaurant
  phoneNumber  String   @db.VarChar(20)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  @@unique([restaurantId, phoneNumber])
  @@index([restaurantId])
}
```

**Purpose**: Store WhatsApp numbers configured by admins for their restaurant. Unique constraint ensures no duplicate numbers per restaurant.

#### WhatsAppOrder (Client Orders from Messages)
```typescript
model WhatsAppOrder {
  id           Int      @id @default(autoincrement())
  restaurantId Int      // Restaurant isolation
  phoneNumber  String   @db.VarChar(20)
  clientName   String?  @db.VarChar(100)
  address      String   @db.Text
  status       String   @default("PENDING")
  totalAmount  Float    @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  items        WhatsAppOrderItem[]
  
  @@index([restaurantId])
  @@index([phoneNumber])
}
```

**Status Values**: `PENDING`, `COMPLETED`

#### WhatsAppOrderItem (Individual Items in Order)
```typescript
model WhatsAppOrderItem {
  id              Int     @id @default(autoincrement())
  whatsappOrderId Int     // Link to order
  menuItemId      Int     // Must belong to same restaurant
  name            String
  description     String?
  quantity        Int     @default(1)
  price           Float
  total           Float

  whatsappOrder   WhatsAppOrder @relation(fields: [whatsappOrderId], references: [id], onDelete: Cascade)
  menuItem        MenuItem      @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

#### Admin Routes (Require `restaurantAuth` + Admin role)

##### 1. Register WhatsApp Number
```
POST /api/admin/whatsapp/numbers
Header: Authorization: Bearer <jwt_token>
Body: {
  "phoneNumber": "+1234567890"
}

Response: {
  "message": "WhatsApp number registered successfully",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "isActive": true,
    "createdAt": "2025-01-10T10:00:00Z"
  }
}
```

🔥 **Security**:
- Only admins of specific restaurant can register numbers
- Number is associated with `restaurantId` from JWT token
- Restaurant data automatically uploaded to Pinecone for RAG

##### 2. Get Pending WhatsApp Orders
```
GET /api/admin/whatsapp/orders/pending
Header: Authorization: Bearer <jwt_token>

Response: [
  {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John",
    "address": "123 Main St",
    "status": "PENDING",
    "totalAmount": 45.99,
    "items": [
      {
        "id": 1,
        "name": "Burger",
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      }
    ]
  }
]
```

🔥 **Security**: Only returns orders for authenticated restaurant

##### 3. Convert & Complete WhatsApp Order
```
POST /api/admin/whatsapp/orders/complete
Header: Authorization: Bearer <jwt_token>
Body: {
  "whatsappOrderId": 1
}

Response: {
  "message": "WhatsApp order converted to regular order successfully",
  "data": {
    "id": 5,
    "restaurantId": 1,
    "status": "PENDING",
    "totalAmount": 45.99,
    "items": [
      {
        "id": 1,
        "menuItemId": 3,
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      }
    ]
  }
}
```

🔥 **Security**: 
- Verifies order belongs to restaurant
- Creates new regular Order with WhatsAppOrder items
- Marks WhatsAppOrder as COMPLETED
- Order is now visible to chefs/order takers

#### Client Routes (Public - No Auth Required)

##### 1. Chat Message (RAG Query)
```
POST /api/whatsapp/message
Body: {
  "phoneNumber": "+1234567890",
  "message": "What's on your menu?",
  "restaurantId": 1
}

Response: {
  "message": "We offer burgers, pizzas, and salads. Our signature burger is $12.99...",
  "restaurantId": 1,
  "phoneNumber": "+1234567890"
}
```

🔥 **Security**:
- Verifies registered WhatsApp number for restaurant
- Queries Pinecone with `restaurantId` filter
- Uses LLM with restaurant context to generate response
- No cross-restaurant data leakage

##### 2. Place Order from Message
```
POST /api/whatsapp/order
Body: {
  "phoneNumber": "+1234567890",
  "restaurantId": 1,
  "clientName": "John",
  "address": "123 Main St",
  "items": [
    { "menuItemId": 3, "quantity": 2 },
    { "menuItemId": 5, "quantity": 1 }
  ]
}

Response: {
  "message": "Order created successfully from WhatsApp",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John",
    "address": "123 Main St",
    "status": "PENDING",
    "totalAmount": 45.99,
    "items": [
      {
        "id": 1,
        "whatsappOrderId": 1,
        "menuItemId": 3,
        "name": "Burger",
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      }
    ]
  }
}
```

🔥 **Security**:
- Verifies registered WhatsApp number
- Validates all menu items belong to restaurant
- Creates order linked to correct restaurant
- Prevents cross-restaurant order mixing

### Implementation Details

#### Controller: `whatsappBotController.ts`

**Key Functions**:

1. **`registerWhatsAppNumber`**
   - Only callable by restaurant admins
   - Creates WhatsAppNumber record with restaurantId
   - Triggers Pinecone data upload
   - Returns error if number already registered

2. **`handleClientMessage`**
   - Verifies phone number is registered
   - Queries Pinecone with `restaurantId` filter
   - Uses LLM with restaurant context
   - Returns AI-generated response

3. **`handleOrderMessage`**
   - Creates WhatsAppOrder with all items
   - Validates each menu item belongs to restaurant
   - Calculates total amount
   - Returns order confirmation

4. **`getPendingWhatsAppOrders`**
   - Returns only orders for authenticated restaurant
   - Includes full item details
   - Sorted by creation time

5. **`completeWhatsAppOrder`**
   - Converts WhatsAppOrder to regular Order
   - Creates OrderItem records
   - Marks WhatsAppOrder as COMPLETED
   - Order now visible to chefs

#### Routes: `whatsapp.bot.ts`

All routes follow restaurant isolation pattern:
- Admin routes: `restaurantAuth` + `allowRoles(["Admin"])`
- Client routes: No auth (phone number verification instead)

### Data Flow

#### Order Placement Flow
```
1. Client sends WhatsApp message with order
2. handleOrderMessage validates registered number
3. Creates WhatsAppOrder + WhatsAppOrderItem records
4. Calculates total from menu item prices
5. Admin sees pending order in /admin/whatsapp/orders/pending
6. Admin clicks "complete" to convert to regular Order
7. Order appears in chef queue (getAllOrders.ts)
8. Chef picks and prepares
9. Complete order as normal
```

#### RAG Query Flow
```
1. Client sends chat message
2. handleClientMessage verifies registration
3. Queries Pinecone namespace: `restaurant-{restaurantId}`
4. Retrieves top 5 relevant documents
5. Passes context to LLM with system prompt
6. LLM generates contextual response
7. Response includes only restaurant-specific information
```

### Prisma Queries Pattern

Every operation follows this pattern:

```typescript
// ✅ GOOD - With restaurantId filter
const orders = await prisma.whatsAppOrder.findMany({
  where: {
    restaurantId,  // 🔥 Always filter by restaurant
    status: "PENDING"
  }
});

// ❌ BAD - Without restaurantId filter
const orders = await prisma.whatsAppOrder.findMany({
  where: { status: "PENDING" }
});
```

### Integration with Existing Systems

#### Vector Database (Pinecone)
- **Namespace**: `restaurant-{restaurantId}`
- **Metadata**: Includes `restaurantId` field
- **Documents**: Menu items, articles, restaurant info
- **Query Filter**: `{ restaurantId }` ensures isolation

#### Order System
- **WhatsAppOrder** → Converted to **Order**
- **WhatsAppOrderItem** → Converted to **OrderItem**
- Full integration with chef/admin order management
- Maintains referential integrity

#### Menu Items
- **WhatsAppOrderItem** references **MenuItem**
- Foreign key ensures item belongs to restaurant
- Validates ownership before creating WhatsAppOrder

### Error Handling

All controllers return appropriate HTTP status codes:
- `400` - Missing required fields
- `403` - Unauthorized (not admin)
- `404` - Resource not found
- `409` - Conflict (duplicate number)
- `500` - Server error

### Testing Checklist

- [ ] Admin can register WhatsApp number for restaurant
- [ ] Number appears in registered list
- [ ] Client sends message to registered number
- [ ] RAG returns restaurant-specific information
- [ ] Client places order via WhatsApp
- [ ] Order items use correct restaurant's menu
- [ ] Total amount calculated correctly
- [ ] Admin sees pending order
- [ ] Admin converts to regular order
- [ ] Chef sees order in queue
- [ ] Order complete workflow works
- [ ] Cannot access another restaurant's data
- [ ] Cannot use unregistered phone number

### Security Guarantees

✅ **Middleware Level**: `restaurantAuth` extracts restaurantId from JWT (never from client)

✅ **Controller Level**: Every operation validates restaurantId ownership

✅ **Database Level**: All queries filter by restaurantId; unique constraints prevent duplicates

✅ **No Cross-Restaurant Access**: Impossible to query another restaurant's data

✅ **RAG Isolation**: Pinecone queries use restaurantId metadata filter

### Future Enhancements

1. **Rich Message Content**: Support images, quick replies
2. **Order Tracking**: WhatsApp notifications for order status
3. **Payment Integration**: Accept payments via WhatsApp
4. **Analytics**: WhatsApp-specific reporting and metrics
5. **Multi-Language Support**: Bot responses in local language
6. **Scheduled Messages**: Promotions, opening hours notifications

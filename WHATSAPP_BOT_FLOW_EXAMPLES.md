# WhatsApp Bot - Complete Flow Examples

## 1. Admin Registration Flow

### Step 1: Admin registers WhatsApp number

```bash
curl -X POST http://localhost:3000/api/admin/whatsapp/numbers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

### Step 2: System Response

```json
{
  "message": "WhatsApp number registered successfully",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "isActive": true,
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  }
}
```

### Step 3: Background Operations

```
┌─────────────────────────────────────────┐
│ Admin registration completed            │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ Prepare vectors from restaurant data:   │
│ - Menu items (100+)                     │
│ - Articles (50)                         │
│ - Restaurant info                       │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ Embed each item with OpenAI             │
│ (text-embedding-3-small)                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ Upload to Pinecone namespace:           │
│ restaurant-1 (isolated)                 │
│                                         │
│ Vector count: ~150                      │
│ Metadata: restaurantId=1 for each       │
└─────────────────────────────────────────┘
```

---

## 2. Client Query Flow (RAG)

### Step 1: Client sends question

```bash
curl -X POST http://localhost:3000/api/whatsapp/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "What do you have for vegetarian options?",
    "restaurantId": 1
  }'
```

### Step 2: System Processing

```
┌──────────────────────────────────────────┐
│ Verify phone registration                │
│ - Check: restaurantId=1                  │
│ - Check: phoneNumber="+1234567890"       │
│ - Check: isActive=true                   │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Embed question using OpenAI              │
│ Text: "What vegetarian options?"         │
│ Embedding: [0.123, -0.456, ...]          │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Query Pinecone with filters              │
│ Namespace: restaurant-1                  │
│ Filter: {restaurantId: {$eq: 1}}        │
│ Top K: 5 matches                         │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Format results as context:               │
│                                          │
│ [1] Vegetable Burger - A delicious...    │
│     (Relevance: 95.2%)                   │
│ [2] Garden Salad - Fresh organic...      │
│     (Relevance: 92.1%)                   │
│ [3] Hummus & Veggies - Healthy...        │
│     (Relevance: 88.7%)                   │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Send to LLM (gpt-4o-mini) with context:  │
│                                          │
│ System: "You are a restaurant assistant" │
│ Context: [formatted results above]       │
│ User: "What vegetarian options?"         │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ LLM generates response                   │
└──────────────────────────────────────────┘
```

### Step 3: Client Response

```json
{
  "message": "We have several great vegetarian options! Our Vegetable Burger is a customer favorite at $12.99, and we also offer a fresh Garden Salad for $8.99. For a healthier option, try our Hummus & Veggies plate at $10.99. All items are made with fresh, organic ingredients.",
  "restaurantId": 1,
  "phoneNumber": "+1234567890"
}
```

---

## 3. Order Placement Flow

### Step 1: Client sends order message

```bash
curl -X POST http://localhost:3000/api/whatsapp/order \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "restaurantId": 1,
    "clientName": "John Doe",
    "address": "123 Main Street, Apt 4B",
    "items": [
      {
        "menuItemId": 1,
        "quantity": 2
      },
      {
        "menuItemId": 3,
        "quantity": 1
      }
    ]
  }'
```

### Step 2: Server Validation & Creation

```
┌──────────────────────────────────────────┐
│ Verify phone registration                │
│ - restaurantId: 1 ✓                      │
│ - phoneNumber: "+1234567890" ✓           │
│ - isActive: true ✓                       │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Validate all menu items:                 │
│                                          │
│ Item 1: menuItemId=1                     │
│   - Name: "Burger"                       │
│   - Price: $10.99                        │
│   - Quantity: 2                          │
│   - restaurantId: 1 ✓                    │
│   - Subtotal: $21.98                     │
│                                          │
│ Item 2: menuItemId=3                     │
│   - Name: "Fries"                        │
│   - Price: $4.50                         │
│   - Quantity: 1                          │
│   - restaurantId: 1 ✓                    │
│   - Subtotal: $4.50                      │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Transaction Start                        │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Create WhatsAppOrder:                    │
│ - id: 1                                  │
│ - restaurantId: 1                        │
│ - phoneNumber: "+1234567890"             │
│ - clientName: "John Doe"                 │
│ - address: "123 Main Street, Apt 4B"     │
│ - status: "PENDING"                      │
│ - totalAmount: 0 (temp)                  │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Create WhatsAppOrderItems:               │
│                                          │
│ Item 1:                                  │
│ - whatsappOrderId: 1                     │
│ - menuItemId: 1                          │
│ - name: "Burger"                         │
│ - quantity: 2                            │
│ - price: 10.99                           │
│ - total: 21.98                           │
│                                          │
│ Item 2:                                  │
│ - whatsappOrderId: 1                     │
│ - menuItemId: 3                          │
│ - name: "Fries"                          │
│ - quantity: 1                            │
│ - price: 4.50                            │
│ - total: 4.50                            │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Update WhatsAppOrder totalAmount:        │
│ totalAmount = 21.98 + 4.50 = 26.48       │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Transaction Commit                       │
└──────────────────────────────────────────┘
```

### Step 3: Order Confirmation Response

```json
{
  "message": "Order created successfully from WhatsApp",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John Doe",
    "address": "123 Main Street, Apt 4B",
    "status": "PENDING",
    "totalAmount": 26.48,
    "createdAt": "2025-01-10T11:30:00Z",
    "updatedAt": "2025-01-10T11:30:00Z",
    "items": [
      {
        "id": 1,
        "whatsappOrderId": 1,
        "menuItemId": 1,
        "name": "Burger",
        "description": "Juicy beef burger",
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      },
      {
        "id": 2,
        "whatsappOrderId": 1,
        "menuItemId": 3,
        "name": "Fries",
        "description": "Crispy fries",
        "quantity": 1,
        "price": 4.50,
        "total": 4.50
      }
    ]
  }
}
```

---

## 4. Admin Order Management Flow

### Step 1: Admin views pending orders

```bash
curl -X GET http://localhost:3000/api/admin/whatsapp/orders/pending \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 2: Response with all pending orders

```json
[
  {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John Doe",
    "address": "123 Main Street, Apt 4B",
    "status": "PENDING",
    "totalAmount": 26.48,
    "createdAt": "2025-01-10T11:30:00Z",
    "items": [
      {
        "id": 1,
        "name": "Burger",
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      },
      {
        "id": 2,
        "name": "Fries",
        "quantity": 1,
        "price": 4.50,
        "total": 4.50
      }
    ]
  }
]
```

### Step 3: Admin converts to regular order

```bash
curl -X POST http://localhost:3000/api/admin/whatsapp/orders/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"whatsappOrderId": 1}'
```

### Step 4: Conversion Processing

```
┌──────────────────────────────────────────┐
│ Get WhatsAppOrder:                       │
│ - Verify ownership (restaurantId=1)      │
│ - Load all items                         │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Transaction Start                        │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Create regular Order:                    │
│ - id: 5                                  │
│ - restaurantId: 1                        │
│ - status: "PENDING"                      │
│ - totalAmount: 0 (temp)                  │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Copy items from WhatsAppOrder:           │
│                                          │
│ OrderItem 1:                             │
│ - orderId: 5                             │
│ - menuItemId: 1                          │
│ - quantity: 2                            │
│ - price: 10.99                           │
│ - total: 21.98                           │
│                                          │
│ OrderItem 2:                             │
│ - orderId: 5                             │
│ - menuItemId: 3                          │
│ - quantity: 1                            │
│ - price: 4.50                            │
│ - total: 4.50                            │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Update Order totalAmount = 26.48          │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Mark WhatsAppOrder as COMPLETED          │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Transaction Commit                       │
└──────────────────────────────────────────┘
```

### Step 5: Conversion Confirmation

```json
{
  "message": "WhatsApp order converted to regular order successfully",
  "data": {
    "id": 5,
    "restaurantId": 1,
    "status": "PENDING",
    "totalAmount": 26.48,
    "createdAt": "2025-01-10T11:35:00Z",
    "items": [
      {
        "id": 1,
        "orderId": 5,
        "menuItemId": 1,
        "name": "Burger",
        "quantity": 2,
        "price": 10.99,
        "total": 21.98
      },
      {
        "id": 2,
        "orderId": 5,
        "menuItemId": 3,
        "name": "Fries",
        "quantity": 1,
        "price": 4.50,
        "total": 4.50
      }
    ]
  }
}
```

### Step 6: Chef sees order in queue

```bash
# Chef queries getAllOrders
curl -X GET http://localhost:3000/api/menu-items/chef/orders \
  -H "Authorization: Bearer <chef-token>"
```

**Response** includes the order that was just converted from WhatsApp!

---

## 5. Cross-Restaurant Isolation Example

### ❌ Scenario: Restaurant 2 client tries to use Restaurant 1's number

```bash
curl -X POST http://localhost:3000/api/whatsapp/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Hello",
    "restaurantId": 2  # Wrong restaurant!
  }'
```

### 🔥 System Response: 404 Not Found

```json
{
  "error": "WhatsApp number not found for this restaurant"
}
```

**Why?** The system queries:
```sql
SELECT * FROM "WhatsAppNumber"
WHERE "restaurantId" = 2
  AND "phoneNumber" = '+1234567890'
  AND "isActive" = true
```

Result: **Empty** - Number only exists for restaurant 1!

---

## 6. Prisma Query Patterns

### ✅ SECURE - With restaurantId filter

```typescript
// Get orders for specific restaurant
const orders = await prisma.whatsAppOrder.findMany({
  where: {
    restaurantId,  // 🔥 REQUIRED
    status: "PENDING"
  },
  include: { items: true }
});
```

### ❌ INSECURE - Without restaurantId filter

```typescript
// Gets orders from ALL restaurants!
const orders = await prisma.whatsAppOrder.findMany({
  where: { status: "PENDING" }
});
```

---

## 7. Error Handling Examples

### Missing Phone Number
```bash
curl -X POST http://localhost:3000/api/whatsapp/message \
  -d '{"message": "Hello", "restaurantId": 1}'
```

**Response: 400 Bad Request**
```json
{
  "error": "phoneNumber, message, and restaurantId are required"
}
```

### Invalid Menu Item
```bash
curl -X POST http://localhost:3000/api/whatsapp/order \
  -d '{
    "phoneNumber": "+1234567890",
    "restaurantId": 1,
    "clientName": "John",
    "address": "123 Main St",
    "items": [{"menuItemId": 999, "quantity": 1}]
  }'
```

**Response: 500 Server Error**
```json
{
  "error": "Failed to create order"
}

// Server log: "Menu item 999 not found in restaurant"
```

### Duplicate Number Registration
```bash
curl -X POST http://localhost:3000/api/admin/whatsapp/numbers \
  -d '{"phoneNumber": "+1234567890"}'
```

**Response: 409 Conflict**
```json
{
  "error": "WhatsApp number already registered for this restaurant"
}
```

---

## Summary

The WhatsApp bot provides:
- ✅ **Complete restaurant isolation** at all layers
- ✅ **RAG-powered responses** using Pinecone vectors
- ✅ **Seamless order integration** with existing system
- ✅ **Secure admin controls** for number management
- ✅ **Transaction safety** for order creation
- ✅ **Proper error handling** at all endpoints

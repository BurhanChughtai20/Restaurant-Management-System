# WhatsApp Bot - Setup & Testing Guide

## Prerequisites

### Required Environment Variables
```bash
# In .env file
OPENAI_API_KEY=sk-...  # OpenAI API key for embeddings & LLM
PINECONE_API_KEY=...   # Pinecone API key for vector DB
PINECONE_INDEX=...     # Pinecone index name
JWT_SECRET=...         # JWT secret for authentication
DATABASE_URL=...       # PostgreSQL connection string
REDIS_URL=...          # Redis connection string (optional)
```

### Required Dependencies

The project uses:
- **@langchain/openai** - For embeddings and LLM calls
- **@pinecone-database/pinecone** - For vector database
- **@prisma/client** - For database ORM
- **fastify** - Web framework
- **@fastify/jwt** - JWT authentication

Install if not already present:
```bash
npm install @langchain/openai @pinecone-database/pinecone
```

---

## Setup Steps

### 1. Update Prisma Schema ✅ (Already Done)

The schema already includes:
```prisma
model WhatsAppNumber { ... }
model WhatsAppOrder { ... }
model WhatsAppOrderItem { ... }
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name add_whatsapp_bot
```

This creates the WhatsApp tables in PostgreSQL.

### 3. Verify Files Created ✅ (Already Done)

```
src/
  controller/
    WhatsAppBot/
      whatsappBotController.ts  ✅
  libs/
    ragHelper.ts  ✅
  routes/
    whatsapp.bot.ts  ✅
  routes/
    route.ts  ✅ (updated with whatsappBotRoutes)
```

### 4. Start Server

```bash
npm run dev
```

Server should start without errors. Check logs for:
```
Prisma PostgreSQL connected ✅
Redis connected ✅
```

---

## API Endpoint Testing

### Test 1: Admin Registration (Postman/cURL)

**Endpoint**: `POST http://localhost:3000/api/admin/whatsapp/numbers`

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body**:
```json
{
  "phoneNumber": "+1234567890"
}
```

**Expected Response** (201 Created):
```json
{
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

**What Happens**:
1. ✅ Verifies JWT token and extracts restaurantId
2. ✅ Checks user is admin of restaurant
3. ✅ Verifies number isn't already registered
4. ✅ Creates WhatsAppNumber record
5. ✅ Syncs restaurant data to Pinecone (background)

---

### Test 2: Client Chat Message (RAG Query)

**Endpoint**: `POST http://localhost:3000/api/whatsapp/message`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "phoneNumber": "+1234567890",
  "message": "What are your vegetarian options?",
  "restaurantId": 1
}
```

**Expected Response** (200 OK):
```json
{
  "message": "We have several vegetarian options including our Vegetable Burger ($12.99), Garden Salad ($8.99), and Hummus & Veggies plate ($10.99)...",
  "restaurantId": 1,
  "phoneNumber": "+1234567890"
}
```

**What Happens**:
1. ✅ Verifies phone number is registered for restaurant
2. ✅ Queries Pinecone with restaurantId filter
3. ✅ Embeds question using OpenAI
4. ✅ Retrieves top 5 relevant documents
5. ✅ Passes context to LLM
6. ✅ Returns restaurant-specific response

**Debugging**: Check server logs for:
```
RAG query: 5 matches found
LLM response generated
```

---

### Test 3: Place Order from Chat

**Endpoint**: `POST http://localhost:3000/api/whatsapp/order`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "phoneNumber": "+1234567890",
  "restaurantId": 1,
  "clientName": "John Doe",
  "address": "123 Main Street, Apartment 4B",
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
}
```

**Expected Response** (201 Created):
```json
{
  "message": "Order created successfully from WhatsApp",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John Doe",
    "address": "123 Main Street, Apartment 4B",
    "status": "PENDING",
    "totalAmount": 26.48,
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
}
```

**What Happens**:
1. ✅ Verifies phone number is registered
2. ✅ Validates all menu items belong to restaurant
3. ✅ Creates WhatsAppOrder record
4. ✅ Creates WhatsAppOrderItem records
5. ✅ Calculates total amount
6. ✅ Returns order confirmation

**Debugging**: Check PostgreSQL:
```sql
SELECT * FROM "WhatsAppOrder" WHERE "restaurantId" = 1;
SELECT * FROM "WhatsAppOrderItem" WHERE "whatsappOrderId" = 1;
```

---

### Test 4: Admin View Pending Orders

**Endpoint**: `GET http://localhost:3000/api/admin/whatsapp/orders/pending`

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response** (200 OK):
```json
[
  {
    "id": 1,
    "restaurantId": 1,
    "phoneNumber": "+1234567890",
    "clientName": "John Doe",
    "address": "123 Main Street, Apartment 4B",
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

**What Happens**:
1. ✅ Verifies JWT token and extracts restaurantId
2. ✅ Queries WhatsAppOrders with status="PENDING" and restaurantId filter
3. ✅ Includes all items with details
4. ✅ Returns sorted by creation time

---

### Test 5: Admin Convert Order to Regular Order

**Endpoint**: `POST http://localhost:3000/api/admin/whatsapp/orders/complete`

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body**:
```json
{
  "whatsappOrderId": 1
}
```

**Expected Response** (200 OK):
```json
{
  "message": "WhatsApp order converted to regular order successfully",
  "data": {
    "id": 5,
    "restaurantId": 1,
    "status": "PENDING",
    "totalAmount": 26.48,
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

**What Happens**:
1. ✅ Gets WhatsAppOrder with restaurantId verification
2. ✅ Creates new regular Order
3. ✅ Copies all items to OrderItem table
4. ✅ Marks WhatsAppOrder as COMPLETED
5. ✅ Returns new order (which chef/waiter can see)

**Verification**: Chef can now see order:
```bash
curl -X GET http://localhost:3000/api/menu-items/chef/orders \
  -H "Authorization: Bearer <chef-token>"
```

---

## Security Testing

### Test 1: Cross-Restaurant Access Prevention

**Scenario**: Restaurant 2 tries to use Restaurant 1's WhatsApp number

```bash
curl -X POST http://localhost:3000/api/whatsapp/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Hello",
    "restaurantId": 2
  }'
```

**Expected Response** (404 Not Found):
```json
{
  "error": "WhatsApp number not found for this restaurant"
}
```

✅ **PASS** - Cross-restaurant access blocked at database level

---

### Test 2: Unauthorized Admin Access

**Scenario**: Non-admin user tries to register number

```bash
curl -X POST http://localhost:3000/api/admin/whatsapp/numbers \
  -H "Authorization: Bearer <non-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+9999999999"}'
```

**Expected Response** (403 Forbidden):
```json
{
  "error": "Only restaurant admins can register WhatsApp numbers"
}
```

✅ **PASS** - Role-based access control enforced

---

### Test 3: Invalid Menu Item Cross-Restaurant

**Scenario**: Order includes menu item from different restaurant

```bash
curl -X POST http://localhost:3000/api/whatsapp/order \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "restaurantId": 1,
    "clientName": "John",
    "address": "123 Main St",
    "items": [
      {
        "menuItemId": 999,
        "quantity": 1
      }
    ]
  }'
```

**Expected Response** (500 Server Error):
```json
{
  "error": "Failed to create order"
}
```

**Server Logs**:
```
Menu item 999 not found in restaurant
```

✅ **PASS** - Cross-restaurant menu items rejected

---

## Database Verification

### Check WhatsAppNumber table

```sql
SELECT * FROM "WhatsAppNumber"
WHERE "restaurantId" = 1;
```

Expected output:
```
id  | restaurantId | phoneNumber    | isActive | createdAt           
----+--------------+----------------+----------+--------------------
 1  |      1       | +1234567890    |  true    | 2025-01-10 10:00:00
```

### Check WhatsAppOrder table

```sql
SELECT * FROM "WhatsAppOrder"
WHERE "restaurantId" = 1
ORDER BY "createdAt" DESC;
```

Expected output:
```
id | restaurantId | phoneNumber    | clientName | status    | totalAmount | createdAt
---+--------------+----------------+------------+-----------+-------------+---
 1 |      1       | +1234567890    | John Doe   | PENDING   | 26.48       | ...
```

### Check WhatsAppOrderItem table

```sql
SELECT * FROM "WhatsAppOrderItem"
WHERE "whatsappOrderId" = 1;
```

Expected output:
```
id | whatsappOrderId | menuItemId | name   | quantity | price | total
---+-----------------+------------+--------+----------+-------+------
 1 |        1        |     1      | Burger |    2     | 10.99 | 21.98
 2 |        1        |     3      | Fries  |    1     | 4.50  | 4.50
```

---

## Pinecone Verification

### Check uploaded vectors

```typescript
// In Node.js REPL with Pinecone SDK
const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.Index("your-index-name").namespace("restaurant-1");
const stats = await index.describeIndexStats();

console.log(stats);
```

Expected output:
```
{
  "namespaces": {
    "restaurant-1": {
      "recordCount": 150
    }
  }
}
```

Approximately 150 vectors should be uploaded (menu items + articles + info).

---

## Common Issues & Solutions

### Issue 1: 404 "WhatsApp number not found"
**Cause**: Phone number not registered or restaurantId mismatch
**Solution**: 
1. Register number first: `POST /api/admin/whatsapp/numbers`
2. Use exact same restaurantId in request

### Issue 2: LLM response is generic
**Cause**: Pinecone data not synced yet
**Solution**:
1. Wait 2-3 seconds after registration
2. Check Pinecone index has vectors
3. Verify restaurantId in metadata

### Issue 3: Order creation fails with menu item error
**Cause**: Menu item ID is invalid or belongs to different restaurant
**Solution**:
1. Verify menuItemId exists: `SELECT id FROM "MenuItem" WHERE "restaurantId" = 1;`
2. Use valid IDs in items array

### Issue 4: Admin cannot convert order
**Cause**: User not admin or order already converted
**Solution**:
1. Verify user has Admin role
2. Check order status is still "PENDING"
3. Verify restaurantId matches

---

## Performance Notes

**Optimization Tips**:
1. **Vector Database**: Queries typically return in <100ms
2. **LLM Latency**: Expect 1-2 second response time
3. **Database**: Indexed queries on restaurantId, phoneNumber
4. **Batch Processing**: RAG top-K default is 5 (tunable)

**Scaling Considerations**:
- Each restaurant gets isolated Pinecone namespace
- Unique constraint prevents duplicate phone numbers
- Cascade deletes maintain referential integrity
- Consider pagination for large order lists

---

## Monitoring

### Server Logs to Monitor

```
✅ "RAG query: N matches found"
✅ "LLM response generated"
✅ "WhatsApp number registered"
❌ "Menu item not found in restaurant"
❌ "Unauthorized access attempt"
```

### Database Queries to Monitor

```sql
-- Check for orphaned WhatsAppOrderItems
SELECT * FROM "WhatsAppOrderItem"
WHERE "whatsappOrderId" NOT IN (SELECT id FROM "WhatsAppOrder");

-- Check for invalid restaurantId references
SELECT * FROM "WhatsAppOrder"
WHERE "restaurantId" NOT IN (SELECT id FROM "Restaurant");
```

---

## Next Steps After Testing

1. ✅ All endpoints working
2. ✅ Restaurant isolation verified
3. ✅ Database constraints enforced
4. ✅ RAG responses accurate
5. 📋 Then proceed with:
   - Add WhatsApp webhook integration
   - Implement push notifications
   - Add order tracking
   - Setup analytics
   - Implement payment integration

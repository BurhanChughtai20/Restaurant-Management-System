# WhatsApp Bot - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Environment Setup
```bash
# Add to .env file
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=...
```

### Step 2: Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
```

### Step 3: Start Server
```bash
npm run dev
```

### Step 4: Test Registration (cURL)
```bash
curl -X POST http://localhost:3000/api/admin/whatsapp/numbers \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

### Step 5: Test Chat (cURL)
```bash
curl -X POST http://localhost:3000/api/whatsapp/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "What is your menu?",
    "restaurantId": 1
  }'
```

---

## 📋 API Reference Quick Summary

### Admin Routes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/whatsapp/numbers` | Register WhatsApp number |
| GET | `/api/admin/whatsapp/orders/pending` | View pending orders |
| POST | `/api/admin/whatsapp/orders/complete` | Convert to regular order |

### Client Routes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/whatsapp/message` | Send question (RAG) |
| POST | `/api/whatsapp/order` | Place order |

---

## 🔧 Key Configurations

### Pinecone Namespace
- Format: `restaurant-{restaurantId}`
- ~150 vectors per restaurant
- Auto-created on number registration

### Vector Metadata
```json
{
  "restaurantId": 1,
  "type": "menuItem|article|restaurant",
  "text": "...",
  "itemName": "...",
  "price": 10.99
}
```

### LLM Configuration
- Model: `gpt-4o-mini`
- Embeddings: `text-embedding-3-small`
- Context: Top 5 Pinecone results

---

## 🔒 Security Summary

**Golden Rule**: 
> restaurantId ALWAYS comes from JWT middleware, NEVER from client input

**Three Layers**:
1. Middleware validates JWT → extracts restaurantId
2. Controller validates ownership → filters by restaurantId
3. Database query includes → WHERE restaurantId = X

---

## 🧪 Common Test Cases

### Admin Register Number
```bash
POST /api/admin/whatsapp/numbers
Authorization: Bearer <token>
{"phoneNumber": "+1234567890"}
→ 201 Created
```

### Client Chat
```bash
POST /api/whatsapp/message
{"phoneNumber": "+1234567890", "message": "Menu?", "restaurantId": 1}
→ 200 OK (with RAG response)
```

### Place Order
```bash
POST /api/whatsapp/order
{
  "phoneNumber": "+1234567890",
  "restaurantId": 1,
  "clientName": "John",
  "address": "123 Main St",
  "items": [{"menuItemId": 1, "quantity": 2}]
}
→ 201 Created
```

### Admin View Orders
```bash
GET /api/admin/whatsapp/orders/pending
Authorization: Bearer <token>
→ 200 OK (array of orders)
```

### Convert Order
```bash
POST /api/admin/whatsapp/orders/complete
Authorization: Bearer <token>
{"whatsappOrderId": 1}
→ 200 OK
```

---

## 🐛 Troubleshooting

### "WhatsApp number not found"
- Did you register the number first?
- Does restaurantId match?
- Is number active?

### "Menu item not found"
- Check menuItemId exists
- Verify it belongs to same restaurant
- Use: `SELECT id FROM "MenuItem" WHERE "restaurantId" = 1`

### "Only restaurant admins can register"
- Is user an admin?
- Check JWT has correct role
- Verify restaurantId in token

### "Order conversion fails"
- Check order status is PENDING
- Verify restaurantId matches
- Check all items exist

---

## 📁 File Structure

```
src/
├── controller/WhatsAppBot/
│   └── whatsappBotController.ts    ← Main logic
├── libs/
│   └── ragHelper.ts                ← RAG functions
└── routes/
    └── whatsapp.bot.ts             ← Routes

prisma/
├── schema.prisma                   ← Models
└── migrations/                     ← Database

Documentation/
├── WHATSAPP_BOT_GUIDE.md
├── WHATSAPP_BOT_SETUP_TESTING.md
└── ... (5 docs total)
```

---

## 🔍 Debug Commands

### Check WhatsApp Numbers
```sql
SELECT * FROM "WhatsAppNumber" WHERE "restaurantId" = 1;
```

### Check Orders
```sql
SELECT * FROM "WhatsAppOrder" WHERE "restaurantId" = 1;
```

### Check Items
```sql
SELECT * FROM "WhatsAppOrderItem" WHERE "whatsappOrderId" = 1;
```

### Check Pinecone Vectors
```typescript
const index = pc.Index("index-name").namespace("restaurant-1");
const stats = await index.describeIndexStats();
console.log(stats); // Should show recordCount ~150
```

---

## 📚 Documentation

| Document | Read When |
|----------|-----------|
| WHATSAPP_BOT_GUIDE.md | You need complete API reference |
| WHATSAPP_BOT_FLOW_EXAMPLES.md | You want to understand flows |
| WHATSAPP_BOT_SETUP_TESTING.md | You need to test locally |
| WHATSAPP_BOT_IMPLEMENTATION_SUMMARY.md | You want overview |
| WHATSAPP_BOT_COMPLETE_SUMMARY.md | You need executive summary |

---

## 💡 Pro Tips

### Tip 1: Always Check restaurantId
```typescript
// In any controller
const restaurantId = (req as any).restaurantId;
if (!restaurantId) throw new Error("No restaurantId!");
```

### Tip 2: Validate Menu Items
```typescript
// Before creating order
const item = await prisma.menuItem.findFirst({
  where: { id: menuItemId, restaurantId }
});
if (!item) throw new Error("Invalid menu item");
```

### Tip 3: Use Transactions
```typescript
// For multi-step operations
const result = await prisma.$transaction(async (tx) => {
  // Multiple operations
  return result;
});
```

### Tip 4: Filter Pinecone Queries
```typescript
// Always include restaurantId filter
const results = await index.query({
  filter: { restaurantId: { $eq: restaurantId } }
});
```

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T**: Trust restaurantId from client
```typescript
// WRONG!
const restaurantId = req.body.restaurantId;
```

✅ **DO**: Always use middleware value
```typescript
// RIGHT!
const restaurantId = (req as any).restaurantId;
```

---

❌ **DON'T**: Skip menu item validation
```typescript
// WRONG!
const order = await prisma.whatsAppOrder.create({
  data: { items: clientItems } // Not validated!
});
```

✅ **DO**: Validate items belong to restaurant
```typescript
// RIGHT!
const menuItem = await prisma.menuItem.findFirst({
  where: { id: menuItemId, restaurantId }
});
```

---

❌ **DON'T**: Query without filters
```typescript
// WRONG! Gets all orders from all restaurants
const orders = await prisma.whatsAppOrder.findMany();
```

✅ **DO**: Always filter by restaurantId
```typescript
// RIGHT!
const orders = await prisma.whatsAppOrder.findMany({
  where: { restaurantId }
});
```

---

## ✅ Deployment Checklist

- [ ] Environment variables set
- [ ] Database migrated
- [ ] Prisma generated
- [ ] Server compiled
- [ ] All endpoints tested
- [ ] Pinecone data synced
- [ ] Logs monitored
- [ ] Error handling verified
- [ ] WhatsApp webhook ready

---

## 🎓 Next Steps

1. **Deploy to staging** - Test all endpoints
2. **Monitor logs** - Watch for errors
3. **Integrate webhook** - Connect WhatsApp API
4. **Setup notifications** - Order status updates
5. **Add analytics** - Track usage
6. **Optimize performance** - Fine-tune RAG

---

## 🤝 Need Help?

### Check the Docs
1. API not working? → `WHATSAPP_BOT_GUIDE.md`
2. Need examples? → `WHATSAPP_BOT_FLOW_EXAMPLES.md`
3. Testing issues? → `WHATSAPP_BOT_SETUP_TESTING.md`
4. Lost in implementation? → `WHATSAPP_BOT_COMPLETE_SUMMARY.md`

### Common URLs
- API Base: `http://localhost:3000/api`
- Admin Routes: `/api/admin/whatsapp/*`
- Client Routes: `/api/whatsapp/*`

---

## 🎉 You're Ready!

Everything is set up and documented. Time to:
1. Register your first WhatsApp number
2. Have your first chat
3. Place your first order
4. Deploy to production

**Good luck! 🚀**

---

**Questions?** Refer to the 5 documentation files provided.
**Issues?** Check WHATSAPP_BOT_SETUP_TESTING.md Troubleshooting section.
**Want more?** See WHATSAPP_BOT_COMPLETE_SUMMARY.md for full details.

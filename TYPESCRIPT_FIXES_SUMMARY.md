# TypeScript Error Fixes - WhatsApp Bot

## Errors Fixed ✅

### 1. **Pinecone API Error: `queryRequest` property**
**Error**: 
```
Object literal may only specify known properties, and 'queryRequest' does not exist in type 'QueryOptions'.
```

**Files Fixed**:
- `src/libs/ragHelper.ts` - queryPineconeWithRAG()
- `src/controller/WhatsAppBot/handleQuery.ts` - handleQuery()

**Solution**: Updated Pinecone SDK API calls
```typescript
// ❌ OLD (Invalid API)
const results = await index.query({
  queryRequest: {
    vector: embedding,
    topK: 5,
    filter: { restaurantId },
    includeMetadata: true,
  },
});

// ✅ NEW (Correct API)
const results = await index.query({
  vector: embedding,
  topK: 5,
  filter: { restaurantId },
  includeMetadata: true,
});
```

---

### 2. **LLM Undefined Error**
**Error**:
```
Cannot invoke an object which is possibly 'undefined'.
```

**File Fixed**: 
- `src/controller/WhatsAppBot/whatsappBotController.ts` - handleClientMessage()

**Solution**: Added null check before invoking LLM
```typescript
// ✅ Added check
if (!llm) {
  return reply.status(500).send({ error: "LLM service not initialized" });
}

const response = await llm.invoke([...]);
```

---

### 3. **Pinecone Delete API Error**
**Error**:
```
Cannot invoke an object which is possibly 'undefined'.
```

**File Fixed**:
- `src/libs/ragHelper.ts` - deleteRestaurantDataFromPinecone()

**Solution**: Updated deleteMany API call
```typescript
// ❌ OLD (Wrong API structure)
await index.deleteMany(
  (await index.fetch({
    ids: [],
    filter: { restaurantId: { $eq: restaurantId } },
  })).records.map((r: any) => r.id)
);

// ✅ NEW (Correct API)
await index.deleteMany({
  filter: { restaurantId: { $eq: restaurantId } },
});
```

---

### 4. **Missing embedText Function**
**Error**:
```
Cannot find name 'embedText'.
```

**Files Fixed**:
- `src/controller/WhatsAppBot/handleQuery.ts`
- `src/controller/WhatsAppBot/handleAddText.ts`

**Solution**: Added OpenAI embeddings initialization
```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small",
});

// Use it
const embedding = await embeddings.embedQuery(text);
```

---

### 5. **Pinecone Upsert API Error**
**Error**:
```
Object literal may only specify known properties, and 'upsertRequest' does not exist.
```

**File Fixed**:
- `src/controller/WhatsAppBot/handleAddText.ts`

**Solution**: Updated upsert API call
```typescript
// ❌ OLD (Invalid API)
await index.upsert({
  upsertRequest: {
    vectors: [...]
  },
});

// ✅ NEW (Correct API)
await index.upsert([...]);
```

---

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| ragHelper.ts | Removed `queryRequest` wrapper | Pinecone SDK API update |
| ragHelper.ts | Fixed deleteMany API | Correct SDK method signature |
| whatsappBotController.ts | Added llm null check | Type safety for optional service |
| handleQuery.ts | Added embeddings initialization | Replace missing embedText function |
| handleQuery.ts | Fixed query API | Pinecone SDK API update |
| handleAddText.ts | Added embeddings initialization | Replace missing embedText function |
| handleAddText.ts | Fixed upsert API | Pinecone SDK API update |

---

## Verification

All TypeScript compilation errors related to:
- ✅ Pinecone `queryRequest` property
- ✅ LLM undefined invocation
- ✅ Pinecone delete API
- ✅ Missing embedText function
- ✅ Pinecone upsert API

**Status**: FIXED ✅

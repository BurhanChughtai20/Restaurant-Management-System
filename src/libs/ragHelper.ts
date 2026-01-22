import { OpenAIEmbeddings } from "@langchain/openai";
import { pc, indexName } from "./Pinecone.ts";
import prisma from "./prisma.ts";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small",
});

/**
 * Query Pinecone with restaurant isolation
 * 🔥 Always includes restaurantId in filter
 */
export async function queryPineconeWithRAG(
  restaurantId: number,
  query: string,
  topK: number = 5
) {
  try {
    // Generate embedding for query
    const queryEmbedding = await embeddings.embedQuery(query);

    // Get Pinecone index with restaurant namespace
    const index = pc.Index(indexName).namespace(`restaurant-${restaurantId}`);

    // Query with restaurant isolation filter
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: {
        restaurantId: { $eq: restaurantId },
      },
      includeMetadata: true,
    });

    return (
      results.matches?.map((match: any) => ({
        id: match.id,
        score: match.score,
        text: match.metadata?.text || "",
        metadata: match.metadata,
      })) || []
    );
  } catch (err) {
    console.error("RAG query error:", err);
    throw err;
  }
}

/**
 * Prepare restaurant data for vector embeddings
 * 🔥 Includes restaurantId in metadata for all vectors
 */
export async function prepareRestaurantVectorsForPinecone(
  restaurantId: number
) {
  const vectors: any[] = [];

  try {
    // Get restaurant details
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (restaurant) {
      vectors.push({
        id: `restaurant-${restaurantId}-info`,
        values: await embeddings.embedQuery(`Restaurant: ${restaurant.name}`),
        metadata: {
          restaurantId,
          type: "restaurant",
          text: `Welcome to ${restaurant.name}. We are a restaurant dedicated to serving delicious food.`,
          name: restaurant.name,
        },
      });
    }

    // Get menu items
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId },
    });

    for (const item of menuItems) {
      vectors.push({
        id: `menuItem-${item.id}`,
        values: await embeddings.embedQuery(
          `${item.name}: ${item.description || ""}`
        ),
        metadata: {
          restaurantId,
          type: "menuItem",
          text: `${item.name} - ${
            item.description || "A delicious option"
          } - $${item.price}`,
          itemName: item.name,
          price: item.price,
          description: item.description,
        },
      });
    }

    // Get articles/blog posts
    const articles = await prisma.article.findMany({
      where: {
        restaurantId,
        isPublished: true,
      },
    });

    for (const article of articles) {
      vectors.push({
        id: `article-${article.id}`,
        values: await embeddings.embedQuery(
          `${article.title}: ${article.description}`
        ),
        metadata: {
          restaurantId,
          type: "article",
          text: `${article.title} - ${article.description}`,
          title: article.title,
        },
      });
    }

    return vectors;
  } catch (err) {
    console.error("Error preparing restaurant vectors:", err);
    throw err;
  }
}

/**
 * Upload prepared vectors to Pinecone with restaurant isolation
 * 🔥 Uses restaurant namespace for isolation
 */
export async function uploadRestaurantVectorsToPinecone(
  restaurantId: number,
  vectors: any[]
) {
  try {
    const index = pc.Index(indexName).namespace(`restaurant-${restaurantId}`);

    // Batch upload vectors
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(
        `Uploaded ${Math.min(i + batchSize, vectors.length)}/${
          vectors.length
        } vectors for restaurant ${restaurantId}`
      );
    }

    console.log(
      `✅ Successfully uploaded ${vectors.length} vectors for restaurant ${restaurantId}`
    );
  } catch (err) {
    console.error("Error uploading vectors to Pinecone:", err);
    throw err;
  }
}

/**
 * Sync restaurant data to Pinecone (run when restaurant data changes)
 * 🔥 Complete restaurant isolation with namespace
 */
export async function syncRestaurantDataToPinecone(restaurantId: number) {
  try {
    console.log(`🔄 Syncing restaurant ${restaurantId} data to Pinecone...`);

    // Prepare vectors
    const vectors = await prepareRestaurantVectorsForPinecone(restaurantId);

    // Upload to Pinecone
    if (vectors.length > 0) {
      await uploadRestaurantVectorsToPinecone(restaurantId, vectors);
    } else {
      console.log(`No data to sync for restaurant ${restaurantId}`);
    }
  } catch (err) {
    console.error("Error syncing restaurant data:", err);
    throw err;
  }
}

/**
 * Delete restaurant data from Pinecone (when restaurant is deleted)
 * 🔥 Cleans up entire namespace for restaurant
 */
export async function deleteRestaurantDataFromPinecone(restaurantId: number) {
  try {
    console.log(`🗑️ Deleting data for restaurant ${restaurantId}...`);

    const index = pc.Index(indexName).namespace(`restaurant-${restaurantId}`);

    // Delete all vectors with this restaurant's ID
    // Using deleteMany with filter to delete all vectors in namespace
    await index.deleteMany({
      filter: { restaurantId: { $eq: restaurantId } },
    });

    console.log(`✅ Deleted Pinecone data for restaurant ${restaurantId}`);
  } catch (err) {
    console.error("Error deleting restaurant data from Pinecone:", err);
    throw err;
  }
}

/**
 * Generate RAG context for LLM
 * 🔥 Returns formatted context from top K similar documents
 */
export function formatRAGContext(matches: any[]): string {
  if (!matches.length) {
    return "No relevant information found.";
  }

  return matches
    .map((match, idx) => {
      return `[${idx + 1}] ${match.text} (Relevance: ${(
        match.score * 100
      ).toFixed(1)}%)`;
    })
    .join("\n\n");
}

/**
 * Enhanced RAG query with context formatting
 */
export async function queryWithFormattedContext(
  restaurantId: number,
  query: string
): Promise<{ context: string; matches: any[] }> {
  try {
    const matches = await queryPineconeWithRAG(restaurantId, query, 5);
    const context = formatRAGContext(matches);

    return {
      context,
      matches,
    };
  } catch (err) {
    console.error("RAG query failed:", err);
    return {
      context:
        "I apologize, but I encountered an error retrieving information.",
      matches: [],
    };
  }
}

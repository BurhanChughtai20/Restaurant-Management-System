import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pc, indexName } from "../Pinecone.ts";

export async function getRestaurantRetriever(restaurantId: number) {
  return await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ model: "llama-text-embed-v2" }),
    {
      pineconeIndex: pc.index(indexName),
      filter: { restaurantId },
    }
  );
}

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pc, indexName } from "../Pinecone.ts";
import type { RestaurantData } from "../../types/user.ts";
import { prepareVectors } from "../embedData.ts";

export async function upsertVectors(
  restaurantId: number,
  data: RestaurantData,
) {
  const records = prepareVectors(data, restaurantId);

  await PineconeStore.fromDocuments(
    records.map((r) => ({
      pageContent: r.chunk_text,
      metadata: r.metadata,
    })),
    new OpenAIEmbeddings({ model: "llama-text-embed-v2" }),
    {
      pineconeIndex: pc.index(indexName),
    },
  );

  console.log(
    `Vectors for restaurant ${restaurantId} upserted to Pinecone via LangChain.`,
  );
}

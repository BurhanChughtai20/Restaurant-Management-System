import type { FastifyReply, FastifyRequest } from "fastify";
import { indexName, pc } from "../../libs/Pinecone.ts";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small",
});

export async function handleQuery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { text, restaurantId } = req.body as any;

    if (!text || !restaurantId) {
      return reply
        .status(400)
        .send({ error: "text and restaurantId are required" });
    }

    const embedding = await embeddings.embedQuery(text);

    const index = pc.Index(indexName).namespace(`restaurant-${restaurantId}`);
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      filter: { restaurantId },
      includeMetadata: true,
    });

    return reply.status(200).send(queryResponse.matches);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Failed to query Pinecone" });
  }
}

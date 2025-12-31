import { FastifyReply, FastifyRequest } from "fastify";
import { indexName, pc } from "../../libs/Pinecone.ts";

export async function handleQuery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { text, restaurantId } = req.body as any;

    if (!text || !restaurantId) {
      return reply.status(400).send({ error: 'text and restaurantId are required' });
    }

    const embedding = await embedText(text);

    const index = pc.Index(indexName).namespace(restaurantId);
    const queryResponse = await index.query({
      queryRequest: {
        vector: embedding,
        topK: 5,
        filter: { restaurantId },
        includeMetadata: true,
      },
    });

    return reply.status(200).send(queryResponse.matches);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Failed to query Pinecone' });
  }
}
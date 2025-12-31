 import { FastifyRequest, FastifyReply } from 'fastify'; 
import { indexName, pc } from '../../libs/Pinecone.ts';

// Add text to Pinecone
export async function handleAddText(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id, text, restaurantId } = req.body as any;

    if (!id || !text || !restaurantId) {
      return reply.status(400).send({ error: 'id, text and restaurantId are required' });
    }

    const embedding = await embedText(text);

    // Upsert vector to Pinecone
    const index = pc.Index(indexName);
    await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: id,
            values: embedding,
            metadata: { restaurantId, text },
          },
        ],
      },
    });

    return reply.status(201).send({ message: 'Text added to Pinecone' });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Failed to add text to Pinecone' });
  }
}

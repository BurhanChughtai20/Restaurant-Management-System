import type { FastifyInstance } from 'fastify';
import { handleAddText } from '../controller/WhatsAppBot/handleAddText.ts';
import { handleQuery } from '../controller/WhatsAppBot/handleQuery.ts';

export async function whatsappBotRoutes(fastify: FastifyInstance) {
  // Direct handlers pass kiye hain kyunki Fastify async functions ko support karta hai
  fastify.post('/add', handleAddText);
  fastify.post('/query', handleQuery);
}

export default whatsappBotRoutes;
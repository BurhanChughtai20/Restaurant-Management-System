import { FastifyInstance } from 'fastify';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { handleAddText } from '../controller/WhatsAppBot/handleAddText.ts';
import { handleQuery } from '../controller/WhatsAppBot/handleQuery.ts';
 
export async function whatsappBotRoutes(fastify: FastifyInstance) {
  fastify.post('/add', asyncHandler(handleAddText));
  fastify.post('/query', asyncHandler(handleQuery));
}

export default whatsappBotRoutes;

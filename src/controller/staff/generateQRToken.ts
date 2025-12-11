import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";

export const generateQRToken = async (req: FastifyRequest, reply: FastifyReply) => {
  const sessionToken = uuidv4(); 
   
  return reply.send({ sessionToken });
};

import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../libs/prisma.ts';

export async function restaurantAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing token' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  // JWT verification
  const decoded: any = request.server.jwt.verify(token);
  const { role } = decoded;

  const userRole = await prisma.userRole.findFirst({
    where: { token, role, isActive: true },
    include: { 
      user: { 
        select: { 
          id: true, 
          restaurantId: true,
          restaurant: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  if (!userRole?.user?.restaurantId) {
    return reply.status(403).send({ error: 'No restaurant access' });
  }

  (request as any).user = userRole.user;
  (request as any).restaurantId = userRole.user.restaurantId;

  // Async function mein done() likhne ki zaroorat nahi hai.
  // Function khatam hona hi kafi hai.
}
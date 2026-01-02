import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import prisma from '../libs/prisma.ts';

export async function restaurantAuth(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded: any = request.server.jwt.verify(token);
  
  const { userId, role } = decoded;
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

  done();
}

import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../libs/prisma.ts';
import { AUTH_HEADER } from '../utils/auth.constants.ts';

export async function restaurantAuth(
  request: FastifyRequest,
  reply: FastifyReply
) : Promise<void> {
  const header = request.headers.authorization;
 if (!header?.startsWith(AUTH_HEADER.PREFIX)) {
     return  reply.status(401).send({ error: 'Unauthorized' });
   }
 
   const token = header.slice(AUTH_HEADER.PREFIX.length);
   try {
    const decoded: any = await request.server.jwt.decode(token);
    const { role } = decoded;
    
  const userRole = await prisma.userRole.findFirst({
    where:{
      userId: decoded.userId,
      role,
      isActive: true,
    },
    include:{
      user:{
        select:{
          id: true,
          name: true,
          email: true,
          restaurantId: true,
          restaurant: {
            select: {id: true, name: true, email: true},
          },
        },
      },
    },
  });

  if (!userRole?.user?.restaurantId) {
    return reply.status(403).send({ error: 'No restaurant access' });
  }

  (request as any).user = userRole.user;
  (request as any).restaurantId = userRole.user.restaurantId;
   } catch (error:any) {
    throw new Error(error.message);
   }
}
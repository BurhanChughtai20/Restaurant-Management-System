import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function WaiterManagementRoutes(fastify:FastifyInstance) {
  fastify.post("/join-waiter ", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const body = request.body as {
          waiterName: string;
          waiterPosition: string;
          waiterShift: string;
          
        }
    } catch (error: any) {
        
    }
  })  
};
export default WaiterManagementRoutes;
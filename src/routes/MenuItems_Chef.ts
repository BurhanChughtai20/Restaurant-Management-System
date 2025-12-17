import { FastifyInstance, FastifyReply } from "fastify";
import { getMenuItemsForChef } from "../controller/menu-itms/chef/getMenuItemsForChef.ts";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";

async function Chef_Mobile_Routes(fastify: FastifyInstance) {
    fastify.get("/menu-items",
        {
            preHandler: [fastify.authenticate, allowRoles([Role.Chef])],
        },
        async (_, reply: FastifyReply) => {
            try {
                const items = await getMenuItemsForChef();
                return reply.send(items);
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        }
    )
};
export default Chef_Mobile_Routes;
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { llm } from "../../libs/langchain.ts";
import {
  queryWithFormattedContext,
  syncRestaurantDataToPinecone,
} from "../../libs/ragHelper.ts";

// 🔥 Admin only - Register WhatsApp number for restaurant
export async function registerWhatsAppNumber(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const restaurantId = (req as any).restaurantId;
    const userId = (req.user as any)?.id;
    const { phoneNumber } = req.body as { phoneNumber: string };

    if (!restaurantId || !phoneNumber) {
      return reply
        .status(400)
        .send({ error: "restaurantId and phoneNumber are required" });
    }

    // 🔥 Verify user is admin of this restaurant
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        restaurantId,
        userRoles: { some: { role: "Admin", isActive: true } },
      },
    });

    if (!user) {
      return reply.status(403).send({
        error: "Only restaurant admins can register WhatsApp numbers",
      });
    }

    // Check if number already registered for this restaurant
    const existing = await prisma.whatsAppNumber.findFirst({
      where: { restaurantId, phoneNumber },
    });

    if (existing) {
      return reply.status(409).send({
        error: "WhatsApp number already registered for this restaurant",
      });
    }

    // Create new WhatsApp number
    const whatsappNumber = await prisma.whatsAppNumber.create({
      data: {
        restaurantId,
        phoneNumber,
        isActive: true,
      },
    });

    // 🔥 Sync restaurant data to Pinecone with restaurant isolation
    try {
      await syncRestaurantDataToPinecone(restaurantId);
    } catch (err) {
      console.error(
        "Failed to sync data to Pinecone, but number created:",
        err
      );
      // Don't fail the request - number is created, RAG just won't have data yet
    }

    return reply.status(201).send({
      message: "WhatsApp number registered successfully",
      data: whatsappNumber,
    });
  } catch (err) {
    console.error("registerWhatsAppNumber error:", err);
    return reply
      .status(500)
      .send({ error: "Failed to register WhatsApp number" });
  }
}

// 🔥 Client message - Query with RAG
export async function handleClientMessage(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { phoneNumber, message, restaurantId } = req.body as {
      phoneNumber: string;
      message: string;
      restaurantId: number;
    };

    if (!phoneNumber || !message || !restaurantId) {
      return reply
        .status(400)
        .send({ error: "phoneNumber, message, and restaurantId are required" });
    }

    // 🔥 Verify WhatsApp number is registered for this restaurant
    const whatsappNumber = await prisma.whatsAppNumber.findFirst({
      where: {
        restaurantId,
        phoneNumber,
        isActive: true,
      },
    });

    if (!whatsappNumber) {
      return reply
        .status(404)
        .send({ error: "WhatsApp number not found for this restaurant" });
    }

    // 🔥 Query vector DB with restaurant isolation using RAG
    const { context, matches } = await queryWithFormattedContext(
      restaurantId,
      message
    );

    // Generate response using LLM with context
    if (!llm) {
      return reply.status(500).send({ error: "LLM service not initialized" });
    }

    const response = await llm.invoke([
      {
        role: "system",
        content: `You are a helpful restaurant assistant. Use the following restaurant information to answer questions:
${context}
Be concise, friendly, and helpful. Only provide information about the restaurant.`,
      },
      {
        role: "user",
        content: message,
      },
    ]);

    const botResponse =
      (response.content as string) || "I'm not sure how to help with that.";

    return reply.status(200).send({
      message: botResponse,
      restaurantId,
      phoneNumber,
    });
  } catch (err) {
    console.error("handleClientMessage error:", err);
    return reply.status(500).send({ error: "Failed to process message" });
  }
}

// 🔥 Client orders - Create WhatsApp order
export async function handleOrderMessage(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { phoneNumber, restaurantId, clientName, address, items } =
      req.body as {
        phoneNumber: string;
        restaurantId: number;
        clientName: string;
        address: string;
        items: Array<{ menuItemId: number; quantity: number }>;
      };

    if (!phoneNumber || !restaurantId || !address || !items?.length) {
      return reply.status(400).send({
        error: "phoneNumber, restaurantId, address, and items are required",
      });
    }

    // 🔥 Verify WhatsApp number is registered for this restaurant
    const whatsappNumber = await prisma.whatsAppNumber.findFirst({
      where: {
        restaurantId,
        phoneNumber,
        isActive: true,
      },
    });

    if (!whatsappNumber) {
      return reply
        .status(404)
        .send({ error: "WhatsApp number not found for this restaurant" });
    }

    let totalAmount = 0;

    // Create WhatsApp order with items
    const whatsappOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.whatsAppOrder.create({
        data: {
          restaurantId,
          phoneNumber,
          clientName: clientName || `Client-${phoneNumber}`,
          address,
          status: "PENDING",
          totalAmount: 0,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const menuItem = await tx.menuItem.findFirst({
            where: {
              id: item.menuItemId,
              restaurantId, // 🔥 Ensure menu item belongs to restaurant
            },
          });

          if (!menuItem) {
            throw new Error(
              `Menu item ${item.menuItemId} not found in restaurant`
            );
          }

          const itemTotal = menuItem.price * item.quantity;
          totalAmount += itemTotal;

          return tx.whatsAppOrderItem.create({
            data: {
              whatsappOrderId: newOrder.id,
              menuItemId: menuItem.id,
              name: menuItem.name,
              description: menuItem.description,
              quantity: item.quantity,
              price: menuItem.price,
              total: itemTotal,
            },
          });
        })
      );

      // Update order total
      const updatedOrder = await tx.whatsAppOrder.update({
        where: { id: newOrder.id },
        data: { totalAmount },
        include: { items: true },
      });

      return updatedOrder;
    });

    return reply.status(201).send({
      message: "Order created successfully from WhatsApp",
      data: whatsappOrder,
    });
  } catch (err) {
    console.error("handleOrderMessage error:", err);
    return reply.status(500).send({ error: "Failed to create order" });
  }
}

// 🔥 Get pending WhatsApp orders for order taker
export async function getPendingWhatsAppOrders(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const restaurantId = (req as any).restaurantId;

    const orders = await prisma.whatsAppOrder.findMany({
      where: {
        restaurantId,
        status: "PENDING",
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return reply.status(200).send(orders);
  } catch (err) {
    console.error("getPendingWhatsAppOrders error:", err);
    return reply.status(500).send({ error: "Failed to fetch orders" });
  }
}

// 🔥 Convert WhatsApp order to regular order and mark as completed
export async function completeWhatsAppOrder(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const restaurantId = (req as any).restaurantId;
    const { whatsappOrderId } = req.body as { whatsappOrderId: number };

    if (!whatsappOrderId) {
      return reply.status(400).send({ error: "whatsappOrderId is required" });
    }

    // 🔥 Get WhatsApp order and verify it belongs to restaurant
    const whatsappOrder = await prisma.whatsAppOrder.findFirst({
      where: {
        id: whatsappOrderId,
        restaurantId,
      },
      include: { items: true },
    });

    if (!whatsappOrder) {
      return reply.status(404).send({ error: "WhatsApp order not found" });
    }

    // Convert to regular Order
    let totalAmount = 0;
    const regularOrder = await prisma.$transaction(async (tx) => {
      // Create regular order
      const newOrder = await tx.order.create({
        data: {
          restaurantId,
          status: "PENDING",
          totalAmount: 0,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        whatsappOrder.items.map(async (item) => {
          totalAmount += item.total;

          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              menuItemId: item.menuItemId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            },
          });
        })
      );

      // Update regular order total
      const updated = await tx.order.update({
        where: { id: newOrder.id },
        data: { totalAmount },
        include: { items: true },
      });

      // Mark WhatsApp order as completed
      await tx.whatsAppOrder.update({
        where: { id: whatsappOrderId },
        data: { status: "COMPLETED" },
      });

      return updated;
    });

    return reply.status(200).send({
      message: "WhatsApp order converted to regular order successfully",
      data: regularOrder,
    });
  } catch (err) {
    console.error("completeWhatsAppOrder error:", err);
    return reply.status(500).send({ error: "Failed to complete order" });
  }
}

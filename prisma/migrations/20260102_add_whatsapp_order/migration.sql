-- CreateTable WhatsAppOrder
CREATE TABLE "WhatsAppOrder" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "clientName" VARCHAR(100),
    "address" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable WhatsAppOrderItem
CREATE TABLE "WhatsAppOrderItem" (
    "id" SERIAL NOT NULL,
    "whatsappOrderId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WhatsAppOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable WhatsAppNumber
CREATE TABLE "WhatsAppNumber" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsAppOrder_restaurantId_idx" ON "WhatsAppOrder"("restaurantId");
CREATE INDEX "WhatsAppOrder_phoneNumber_idx" ON "WhatsAppOrder"("phoneNumber");
CREATE UNIQUE INDEX "WhatsAppNumber_restaurantId_phoneNumber_key" ON "WhatsAppNumber"("restaurantId", "phoneNumber");

-- AddForeignKey
ALTER TABLE "WhatsAppOrder" ADD CONSTRAINT "WhatsAppOrder_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
ALTER TABLE "WhatsAppOrderItem" ADD CONSTRAINT "WhatsAppOrderItem_whatsappOrderId_fkey" FOREIGN KEY ("whatsappOrderId") REFERENCES "WhatsAppOrder"("id") ON DELETE CASCADE;
ALTER TABLE "WhatsAppOrderItem" ADD CONSTRAINT "WhatsAppOrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE;
ALTER TABLE "WhatsAppNumber" ADD CONSTRAINT "WhatsAppNumber_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;

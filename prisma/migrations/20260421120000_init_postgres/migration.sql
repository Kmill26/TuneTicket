-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PROMPTS_READY', 'SONG_DELIVERED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING_PAYMENT', 'NEW', 'IN_PROGRESS', 'DELIVERED');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "customerName" TEXT NOT NULL DEFAULT '',
    "accessToken" TEXT NOT NULL,
    "occasion" TEXT NOT NULL DEFAULT '',
    "recipientName" TEXT NOT NULL DEFAULT '',
    "relationship" TEXT NOT NULL DEFAULT '',
    "personality" TEXT NOT NULL DEFAULT '',
    "story" TEXT NOT NULL,
    "emotion" TEXT NOT NULL DEFAULT '',
    "specificLines" TEXT NOT NULL DEFAULT '',
    "genre" TEXT NOT NULL DEFAULT '',
    "mood" TEXT NOT NULL DEFAULT '',
    "vocals" TEXT NOT NULL DEFAULT '',
    "instruments" TEXT NOT NULL DEFAULT '',
    "tempo" TEXT NOT NULL DEFAULT '',
    "production" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "grokPrompt" TEXT NOT NULL,
    "sunoPrompt" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "deliveredAudioUrl" TEXT,
    "deliveredAudioKey" TEXT,
    "deliveredFileName" TEXT,
    "deliveryDownloadToken" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_accessToken_key" ON "Ticket"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_stripeSessionId_key" ON "Ticket"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_deliveryDownloadToken_key" ON "Ticket"("deliveryDownloadToken");

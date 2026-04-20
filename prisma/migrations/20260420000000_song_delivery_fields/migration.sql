-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN "deliveredAudioUrl" TEXT;
ALTER TABLE "Ticket" ADD COLUMN "deliveredAudioKey" TEXT;
ALTER TABLE "Ticket" ADD COLUMN "deliveredFileName" TEXT;
ALTER TABLE "Ticket" ADD COLUMN "deliveryDownloadToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_deliveryDownloadToken_key" ON "Ticket"("deliveryDownloadToken");

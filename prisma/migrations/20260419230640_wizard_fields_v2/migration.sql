/*
  Warnings:

  - You are about to drop the column `audience` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `structure` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `titleHint` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `voice` on the `Ticket` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT,
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
    "status" TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT
);
INSERT INTO "new_Ticket" ("accessToken", "createdAt", "email", "genre", "grokPrompt", "id", "mood", "status", "story", "stripePaymentIntentId", "stripeSessionId", "sunoPrompt", "updatedAt") SELECT "accessToken", "createdAt", "email", "genre", "grokPrompt", "id", "mood", "status", "story", "stripePaymentIntentId", "stripeSessionId", "sunoPrompt", "updatedAt" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_accessToken_key" ON "Ticket"("accessToken");
CREATE UNIQUE INDEX "Ticket_stripeSessionId_key" ON "Ticket"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

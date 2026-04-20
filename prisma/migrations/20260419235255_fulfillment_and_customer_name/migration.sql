-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "status" TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "fulfillmentStatus" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT
);
INSERT INTO "new_Ticket" ("accessToken", "createdAt", "duration", "email", "emotion", "genre", "grokPrompt", "id", "instruments", "mood", "occasion", "personality", "production", "recipientName", "relationship", "specificLines", "status", "story", "stripePaymentIntentId", "stripeSessionId", "sunoPrompt", "tempo", "updatedAt", "vocals") SELECT "accessToken", "createdAt", "duration", "email", "emotion", "genre", "grokPrompt", "id", "instruments", "mood", "occasion", "personality", "production", "recipientName", "relationship", "specificLines", "status", "story", "stripePaymentIntentId", "stripeSessionId", "sunoPrompt", "tempo", "updatedAt", "vocals" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_accessToken_key" ON "Ticket"("accessToken");
CREATE UNIQUE INDEX "Ticket_stripeSessionId_key" ON "Ticket"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

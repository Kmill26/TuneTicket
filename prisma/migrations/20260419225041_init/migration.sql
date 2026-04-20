-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT,
    "accessToken" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "titleHint" TEXT,
    "mood" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "voice" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "structure" TEXT NOT NULL DEFAULT 'Verse–chorus with bridge',
    "language" TEXT NOT NULL DEFAULT 'English',
    "notes" TEXT NOT NULL DEFAULT '',
    "grokPrompt" TEXT NOT NULL,
    "sunoPrompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_accessToken_key" ON "Ticket"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_stripeSessionId_key" ON "Ticket"("stripeSessionId");

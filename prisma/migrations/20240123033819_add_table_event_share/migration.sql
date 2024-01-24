/*
  Warnings:

  - You are about to drop the `user_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_events" DROP CONSTRAINT "user_events_event_id_fkey";

-- DropForeignKey
ALTER TABLE "user_events" DROP CONSTRAINT "user_events_user_id_fkey";

-- DropTable
DROP TABLE "user_events";

-- CreateTable
CREATE TABLE "event_shares" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_shares_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_shares" ADD CONSTRAINT "event_shares_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_shares" ADD CONSTRAINT "event_shares_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_shares" ADD CONSTRAINT "event_shares_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

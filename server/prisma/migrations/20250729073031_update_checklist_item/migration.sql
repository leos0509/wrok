/*
  Warnings:

  - You are about to drop the column `checkListId` on the `ChecklistItem` table. All the data in the column will be lost.
  - Added the required column `checklistId` to the `ChecklistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_checkListId_fkey";

-- AlterTable
ALTER TABLE "ChecklistItem" DROP COLUMN "checkListId",
ADD COLUMN     "checklistId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

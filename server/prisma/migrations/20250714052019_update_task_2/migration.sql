-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
ADD COLUMN     "timeEstimate" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskTag" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL,
    "checkListId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskTag_taskId_tagId_key" ON "TaskTag"("taskId", "tagId");

-- AddForeignKey
ALTER TABLE "TaskTag" ADD CONSTRAINT "TaskTag_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTag" ADD CONSTRAINT "TaskTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_checkListId_fkey" FOREIGN KEY ("checkListId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

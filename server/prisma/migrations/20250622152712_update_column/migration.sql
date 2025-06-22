/*
  Warnings:

  - Made the column `color` on table `Column` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Column" ALTER COLUMN "color" SET NOT NULL;

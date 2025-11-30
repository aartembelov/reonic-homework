/*
  Warnings:

  - You are about to drop the column `unitPrice` on the `invoice_items` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "unitPrice",
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;

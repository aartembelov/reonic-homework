/*
  Warnings:

  - A unique constraint covering the columns `[reference_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoices_reference_id_key" ON "invoices"("reference_id");

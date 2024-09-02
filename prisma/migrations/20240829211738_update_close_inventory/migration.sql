/*
  Warnings:

  - You are about to alter the column `status` on the `inv_document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(1)`.

*/
-- AlterTable
ALTER TABLE `inv_document` MODIFY `status` VARCHAR(1) NOT NULL;

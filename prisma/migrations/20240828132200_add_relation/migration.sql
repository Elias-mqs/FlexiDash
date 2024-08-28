/*
  Warnings:

  - A unique constraint covering the columns `[usr_id,inv_document_id]` on the table `inv_equipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `inv_document` MODIFY `documento` VARCHAR(9) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `inv_equipe_usr_id_inv_document_id_key` ON `inv_equipe`(`usr_id`, `inv_document_id`);

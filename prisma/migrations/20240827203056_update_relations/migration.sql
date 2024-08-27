-- CreateTable
CREATE TABLE `inv_document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento` INTEGER NOT NULL,
    `status` VARCHAR(15) NOT NULL,
    `armazem` VARCHAR(5) NOT NULL,
    `usr_id_ini` INTEGER NOT NULL,
    `dt_ini` VARCHAR(100) NOT NULL,
    `usr_id_fim` INTEGER NULL,
    `dt_fim` VARCHAR(100) NULL,

    INDEX `usr_id_fim`(`usr_id_fim`),
    INDEX `usr_id_ini`(`usr_id_ini`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv_equipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usr_id` INTEGER NOT NULL,
    `inv_document_id` INTEGER NOT NULL,

    INDEX `usr_id`(`usr_id`),
    INDEX `inv_equipe_inv_document_id_idx`(`inv_document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_acess_modulo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usr_id` INTEGER NOT NULL,
    `mod_id` INTEGER NOT NULL,

    INDEX `mod_id`(`mod_id`),
    INDEX `usr_id`(`usr_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_acess_recurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acess_rot_id` INTEGER NOT NULL,
    `rec_rotina_id` INTEGER NOT NULL,

    INDEX `acess_rot_id`(`acess_rot_id`),
    INDEX `rec_rotina_id`(`rec_rotina_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_acess_rotina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acess_mod_id` INTEGER NOT NULL,
    `rotina_id` INTEGER NOT NULL,

    INDEX `acess_mod_id`(`acess_mod_id`),
    INDEX `rotina_id`(`rotina_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_modulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_recurso_rotina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rotina_id` INTEGER NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,

    INDEX `rotina_id`(`rotina_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_rotinas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mod_id` INTEGER NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,

    INDEX `mod_id`(`mod_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sis_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `usuario` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `pass` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inv_document` ADD CONSTRAINT `inv_document_ibfk_2` FOREIGN KEY (`usr_id_ini`) REFERENCES `sis_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inv_document` ADD CONSTRAINT `inv_document_ibfk_3` FOREIGN KEY (`usr_id_fim`) REFERENCES `sis_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inv_equipe` ADD CONSTRAINT `inv_equipe_inv_document_id_fkey` FOREIGN KEY (`inv_document_id`) REFERENCES `inv_document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv_equipe` ADD CONSTRAINT `inv_equipe_ibfk_1` FOREIGN KEY (`usr_id`) REFERENCES `sis_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_modulo` ADD CONSTRAINT `sis_acess_modulo_ibfk_1` FOREIGN KEY (`usr_id`) REFERENCES `sis_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_modulo` ADD CONSTRAINT `sis_acess_modulo_ibfk_2` FOREIGN KEY (`mod_id`) REFERENCES `sis_modulos`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_recurso` ADD CONSTRAINT `sis_acess_recurso_ibfk_1` FOREIGN KEY (`acess_rot_id`) REFERENCES `sis_acess_rotina`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_recurso` ADD CONSTRAINT `sis_acess_recurso_ibfk_2` FOREIGN KEY (`rec_rotina_id`) REFERENCES `sis_recurso_rotina`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_rotina` ADD CONSTRAINT `sis_acess_rotina_ibfk_1` FOREIGN KEY (`acess_mod_id`) REFERENCES `sis_acess_modulo`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_acess_rotina` ADD CONSTRAINT `sis_acess_rotina_ibfk_2` FOREIGN KEY (`rotina_id`) REFERENCES `sis_rotinas`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_recurso_rotina` ADD CONSTRAINT `sis_recurso_rotina_ibfk_1` FOREIGN KEY (`rotina_id`) REFERENCES `sis_rotinas`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sis_rotinas` ADD CONSTRAINT `sis_rotinas_ibfk_1` FOREIGN KEY (`mod_id`) REFERENCES `sis_modulos`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

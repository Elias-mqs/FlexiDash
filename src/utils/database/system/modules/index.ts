import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ModuleProps {
  id: number
  nome: string
}

const findModuleById = async (modId: number) => {
  const sisModule = await prisma.sis_modulos.findUnique({
    where: { id: modId },
  })
  return sisModule as ModuleProps
}

const createModule = async (dataMod: { name: string; slug: string }) => {
  await prisma.sis_modulos.create({
    data: {
      nome: dataMod.name,
      slug: dataMod.slug,
    },
  })
}

export const modules = {
  findModuleById,
  createModule,
}

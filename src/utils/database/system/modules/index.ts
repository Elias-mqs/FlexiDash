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
  return sisModule
}

const findManyModules = async (modId: number): Promise<ModuleProps[]> => {
  const manyMod = await prisma.sis_modulos.findMany({
    where: {
      id: modId,
    },
  })
  return manyMod
}

const createModule = async (dataMod: { name: string }) => {
  await prisma.sis_modulos.create({
    data: {
      nome: dataMod.name,
    },
  })
}

export const modules = {
  findModuleById,
  createModule,
  findManyModules,
}

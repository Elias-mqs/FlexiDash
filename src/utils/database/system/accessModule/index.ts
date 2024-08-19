import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AccessProps {
  id: number
  mod_id: number
  sis_modulos: {
    nome: string
  }
}

const findAcsMod = async (acsModId: { usrId: number }): Promise<AccessProps[] | null> => {
  const accessMod = await prisma.sis_acess_modulo.findMany({
    select: {
      id: true,
      mod_id: true, // Seleciona o ID do módulo
      sis_modulos: {
        select: {
          nome: true, // Seleciona o nome do módulo
        },
      },
    },
    where: {
      usr_id: acsModId.usrId,
    },
  })
  if (accessMod === null) {
    return null
  } else {
    return accessMod as AccessProps[]
  }
}

const createAcsMod = async (acsMod: { usrId: number; modId: number }) => {
  await prisma.sis_acess_modulo.create({
    data: {
      usr_id: acsMod.usrId,
      mod_id: acsMod.modId,
    },
  })
}

export const accessMod = {
  findAcsMod,
  createAcsMod,
}

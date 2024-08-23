import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AccessProps {
  id: number
  mod_id: number
  sis_modulos: {
    nome: string
    slug: string
  }
}

const findAcsMod = async (acsModId: { usrId: number }): Promise<AccessProps[] | null> => {
  const accessMod = await prisma.sis_acess_modulo.findMany({
    select: {
      id: true,
      mod_id: true,
      sis_modulos: {
        select: {
          nome: true,
          slug: true,
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

interface ListModulesProps {
  sis_modulos: {
    nome: string
    slug: string
  }
}

const listModules = async (usrId: number) => {
  const list: ListModulesProps[] = await prisma.sis_acess_modulo.findMany({
    select: {
      sis_modulos: {
        select: {
          nome: true,
          slug: true,
        },
      },
    },
    where: {
      usr_id: usrId,
    },
  })
  if (list === null) {
    return null
  } else {
    return list
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
  listModules,
}

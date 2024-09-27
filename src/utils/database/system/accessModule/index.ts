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

// Função para associar os módulos ao usuário
async function createModuleAccess(userId: number, moduleIds: number[]) {
  const promises = moduleIds.map((modId) =>
    prisma.sis_acess_modulo.create({
      data: {
        usr_id: userId,
        mod_id: modId,
      },
    }),
  )

  return await Promise.all(promises) // Retorna todos os acessos criados
}

export const accessMod = {
  findAcsMod,
  createModuleAccess,
  listModules,
}

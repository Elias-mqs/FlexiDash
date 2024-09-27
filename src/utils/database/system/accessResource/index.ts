import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AcsResourceProps {
  id: number
  sis_recurso_rotina: {
    id: number
    nome: string
    slug: string
  }
}

const findAcsResource = async (data: { acsRtnId: number }) => {
  const access: AcsResourceProps[] = await prisma.sis_acess_recurso.findMany({
    select: {
      id: true,
      sis_recurso_rotina: {
        select: {
          id: true,
          nome: true,
          slug: true,
        },
      },
    },
    where: {
      acess_rot_id: data.acsRtnId,
    },
  })
  if (access === null) {
    return null
  } else {
    return access
  }
}

interface ListResourceProps {
  sis_recurso_rotina: {
    nome: string
    slug: string
  }
}

const listResource = async (acsRtnId: number) => {
  const list: ListResourceProps[] = await prisma.sis_acess_recurso.findMany({
    select: {
      sis_recurso_rotina: {
        select: {
          nome: true,
          slug: true,
        },
      },
    },
    where: {
      acess_rot_id: Number(acsRtnId),
    },
  })

  if (list === null) {
    return []
  } else {
    return list
  }
}

type RoutineAccessesProps = {
  id: number
  acess_mod_id: number
  rotina_id: number
}[]

type ResourceList = {
  id: number
  nome: string
  modId?: number | undefined
  rotinaId?: number | undefined
}

// Função para associar recursos às rotinas
async function createResourceAccess(routineAccesses: RoutineAccessesProps, resourceIds: ResourceList[]) {
  const promises = resourceIds.map((recurso) => {
    // Encontrar o acesso à rotina correspondente ao `rotinaId` do recurso
    const routineAccess = routineAccesses.find((rotina) => rotina.rotina_id === recurso.rotinaId)

    if (!routineAccess) {
      throw new Error(`Acesso à rotina não encontrado para o recurso com rotinaId: ${recurso.rotinaId}`)
    }

    // Criar o acesso ao recurso
    return prisma.sis_acess_recurso.create({
      data: {
        acess_rot_id: routineAccess.id, // ID do acesso à rotina encontrado
        rec_rotina_id: recurso.id, // ID do recurso atual
      },
    })
  })

  return await Promise.all(promises)
}

export const acsResource = {
  findAcsResource,
  createResourceAccess,
  listResource,
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AcsRoutineProps {
  id: number
  sis_rotinas: {
    id: number
    nome: string
    slug: string
  }
}

const findAcsRoutine = async (acsRoutine: { acsModId: number }): Promise<AcsRoutineProps[] | null> => {
  const access: AcsRoutineProps[] = await prisma.sis_acess_rotina.findMany({
    select: {
      id: true,
      sis_rotinas: {
        select: {
          id: true,
          nome: true,
          slug: true,
        },
      },
    },
    where: {
      acess_mod_id: acsRoutine.acsModId,
    },
  })

  if (access === null) {
    return null
  } else {
    return access
  }
}

interface ListRoutineProps {
  sis_rotinas: {
    nome: string
    slug: string
  }
}

const listRoutine = async (acsModId: number) => {
  const list: ListRoutineProps[] = await prisma.sis_acess_rotina.findMany({
    select: {
      sis_rotinas: {
        select: {
          nome: true,
          slug: true,
        },
      },
    },
    where: {
      acess_mod_id: Number(acsModId),
    },
  })

  if (list === null) {
    return []
  } else {
    return list
  }
}

type ModuleAccessesProps = {
  id: number
  usr_id: number
  mod_id: number
}[]

// Função para associar rotinas aos módulos
async function createRoutineAccess(moduleAccesses: ModuleAccessesProps, routineIds: number[]) {
  const promises = routineIds.map((rotinaId) =>
    prisma.sis_acess_rotina.create({
      data: {
        acess_mod_id: moduleAccesses.find((mod) => mod.mod_id === rotinaId)?.id || 0,
        rotina_id: rotinaId,
      },
    }),
  )

  return await Promise.all(promises)
}

export const accessRoutine = {
  findAcsRoutine,
  createRoutineAccess,
  listRoutine,
}

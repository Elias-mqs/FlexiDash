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

const createAcsRoutine = async (dataAcs: { acsModId: number; routineId: number }) => {
  await prisma.sis_acess_rotina.create({
    data: {
      acess_mod_id: dataAcs.acsModId,
      rotina_id: dataAcs.routineId,
    },
  })
}

export const accessRoutine = {
  findAcsRoutine,
  createAcsRoutine,
  listRoutine,
}

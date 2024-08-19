import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AcsRoutineProps {
  id: number
  sis_rotinas: {
    id: number
    nome: string
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
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findAcsRoutine = async (acsRoutine: { modId: number; routineId: number }): Promise<boolean | number> => {
  const access = await prisma.sis_acess_rotina.findFirst({
    where: {
      acess_mod_id: acsRoutine.modId,
      rotina_id: acsRoutine.routineId,
    },
  })

  if (access === null) {
    return false
  } else {
    return access.id
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

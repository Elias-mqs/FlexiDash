import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findAcsResource = async (data: { acsRoutineId: number; recRotId: number }) => {
  const access = await prisma.sis_acess_recurso.findFirst({
    where: {
      acess_rot_id: data.acsRoutineId,
      rec_rotina_id: data.recRotId,
    },
  })
  if (access === null) {
    return false
  } else {
    return access.id
  }
}

const createAcsResource = async (data: { acsRotId: number; recRotinaId: number }) => {
  await prisma.sis_acess_recurso.create({
    data: {
      acess_rot_id: data.acsRotId,
      rec_rotina_id: data.recRotinaId,
    },
  })
}

export const acsResource = {
  findAcsResource,
  createAcsResource,
}

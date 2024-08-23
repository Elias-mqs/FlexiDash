import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findRscRoutine = async (routineId: number) => {
  const rscRoutine = await prisma.sis_recurso_rotina.findMany({
    where: {
      rotina_id: routineId,
    },
  })
  return rscRoutine
}

const createRscRoutine = async (data: { name: string; rotinaId: number; slug: string }) => {
  await prisma.sis_recurso_rotina.create({
    data: {
      nome: data.name,
      rotina_id: data.rotinaId,
      slug: data.slug,
    },
  })
}

export const resourceRoutine = {
  findRscRoutine,
  createRscRoutine,
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findRoutine = async (modId: number) => {
  const routine = prisma.sis_rotinas.findMany({
    where: {
      mod_id: modId,
    },
  })
  return routine
}

const findAllRoutines = async () => {
  const allRoutinesList = await prisma.sis_rotinas.findMany({
    select: {
      id: true,
      nome: true,
    },
  })

  return allRoutinesList
}

const findManyRoutines = async (modIds: number[]) => {
  const listRoutines = await prisma.sis_rotinas.findMany({
    select: {
      id: true,
      nome: true,
      mod_id: true,
    },
    where: {
      mod_id: {
        in: modIds,
      },
    },
  })
  // Transformando a estrutura dos dados para renomear mod_id para modId
  const transformedRoutines = listRoutines.map((routine) => ({
    id: routine.id,
    nome: routine.nome,
    modId: routine.mod_id, // Renomeia mod_id para modId
  }))

  return transformedRoutines
}

const createRoutine = async (routineData: { name: string; modId: number; slug: string }) => {
  await prisma.sis_rotinas.create({
    data: {
      nome: routineData.name,
      mod_id: routineData.modId,
      slug: routineData.slug,
    },
  })
}

export const routines = {
  findRoutine,
  findAllRoutines,
  findManyRoutines,
  createRoutine,
}

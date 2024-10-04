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

const findAllResources = async () => {
  const allResourcesList = await prisma.sis_recurso_rotina.findMany({
    select: {
      id: true,
      nome: true,
    },
  })

  return allResourcesList
}

const findManyResources = async (routineIds: number[]) => {
  const listResources = await prisma.sis_recurso_rotina.findMany({
    select: {
      id: true,
      nome: true,
      rotina_id: true,
    },
    where: {
      rotina_id: {
        in: routineIds,
      },
    },
  })
  // Transformando a estrutura dos dados para renomear rotina_id para rotinaId
  const transformedResources = listResources.map((resource) => ({
    id: resource.id,
    nome: resource.nome,
    rotinaId: resource.rotina_id, // Renomeia rotina_id para rotinaId
  }))

  return transformedResources
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
  findAllResources,
  findManyResources,
  createRscRoutine,
}

import { PrismaClient } from '@prisma/client'

import { accessMod } from './accessModule'
import { acsResource } from './accessResource'
import { accessRoutine } from './accessRoutine'
import { modules } from './modules'
import { resourceRoutine } from './resourceRoutine'
import { routines } from './routine'

const prisma = new PrismaClient()

const findAllFeatures = async () => {
  const allFeatures = await prisma.sis_modulos.findMany({
    select: {
      id: true,
      nome: true,
      sis_rotinas: {
        select: {
          id: true,
          nome: true,
          mod_id: true,
          sis_recurso_rotina: {
            select: {
              id: true,
              nome: true,
              rotina_id: true,
            },
          },
        },
      },
    },
  })
  return allFeatures
}

export const dbSystem = {
  accessMod,
  acsResource,
  accessRoutine,
  modules,
  resourceRoutine,
  routines,
  findAllFeatures,
}

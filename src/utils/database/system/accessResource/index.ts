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
  listResource,
}

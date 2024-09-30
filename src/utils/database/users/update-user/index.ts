import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getUserAccess(userId: number) {
  try {
    const userAccess = await prisma.sis_usuarios.findUnique({
      where: {
        id: userId,
      },
      select: {
        sis_acess_modulo: {
          select: {
            sis_modulos: {
              select: {
                id: true,
                nome: true,
                sis_rotinas: {
                  select: {
                    id: true,
                    nome: true,
                    sis_recurso_rotina: {
                      select: {
                        id: true,
                        nome: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    return userAccess
  } catch (error) {
    console.error('Error fetching user access:', error)
    throw error
  }
}

export const updateUser = {
  getUserAccess,
}

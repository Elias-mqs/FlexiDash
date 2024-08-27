import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type TeamMember = {
  id: number
  nome: string
  email: string
}

async function findTeamMember(rotinaId: number): Promise<TeamMember[]> {
  const teamMembers = await prisma.sis_usuarios.findMany({
    where: {
      // Usuário deve ter acesso à rotina específica
      sis_acess_modulo: {
        some: {
          sis_acess_rotina: {
            some: {
              rotina_id: rotinaId,
            },
          },
        },
      },
      // Usuário deve estar ativo
      ativo: true,
    },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  })

  return teamMembers
}

export const team = {
  findTeamMember,
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type TeamMember = {
  id: number
  nome: string
  email: string
}

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////// ENCONTRAR USUÁRIOS COM PERMISSÃO ////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

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

/// ////////////////////////////////////////////////////////////////////////////
/// ///////////////////// BUSCAR TIME DO INVENTARIO ////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

async function editTeam(document: string, armaz: string, date: string) {
  const documentId = await prisma.inv_document.findFirst({
    where: {
      documento: document,
      armazem: armaz,
      dt_ini: date,
    },
    select: { id: true },
  })

  if (documentId === null) {
    return 'ERROR_FIND_DOCUMENTID'
  }

  const availableMembers: TeamMember[] = await prisma.sis_usuarios.findMany({
    where: {
      inv_equipe: {
        some: {
          inv_document_id: documentId.id,
        },
      },
    },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  })

  if (availableMembers.length < 1) {
    return 'ERROR_FIND_AVAILABLE_MEMBERS'
  }

  return availableMembers
}

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////// CRIAR TIME DO INVENTARIO ////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

async function createTeam(membersId: number[], invDocumentId: number) {
  const data = membersId.map((memberId) => ({
    usr_id: memberId,
    inv_document_id: invDocumentId,
  }))

  try {
    await prisma.inv_equipe.createMany({
      data,
      skipDuplicates: true, // Opcional: Ignora duplicados se houver
    })
  } catch (error) {
    console.error('Error creating records:', error)
  } finally {
    await prisma.$disconnect()
  }
}

/// ////////////////////////////////////////////////////////////////////////////
/// /////////////////// ATUALIZAR TIME DO INVENTARIO ///////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

async function updateTeam(dataTeam: number[], document: string) {
  if (dataTeam.length < 1 || !document) {
    return 'DATA_ERROR'
  }

  const idDocument = await prisma.inv_document.findFirst({
    where: {
      documento: document,
      status: 'I',
    },
    select: {
      id: true,
    },
  })

  if (!idDocument) {
    return 'DOCUMENT_NOT_FOUND'
  }

  const documentId = idDocument.id

  try {
    // Buscar todos os usuários já associados a este documento
    const existingTeamMembers = await prisma.inv_equipe.findMany({
      where: {
        inv_document_id: documentId,
      },
      select: {
        usr_id: true,
      },
    })

    const existingMemberIds = existingTeamMembers.map((member) => member.usr_id)

    // Encontre usuários que precisam ser removidos
    const usersToRemove = existingMemberIds.filter((memberId) => !dataTeam.includes(memberId))

    // Remova os usuários que não estão na nova lista
    await prisma.inv_equipe.deleteMany({
      where: {
        inv_document_id: documentId,
        usr_id: {
          in: usersToRemove,
        },
      },
    })

    // Usar Promise.all para inserir novos usuários
    const data = dataTeam.map((memberId) => ({
      usr_id: memberId,
      inv_document_id: documentId,
    }))

    await Promise.all(
      data.map(async (member) => {
        await prisma.inv_equipe.upsert({
          where: {
            usr_id_inv_document_id: {
              usr_id: member.usr_id,
              inv_document_id: member.inv_document_id,
            },
          },
          update: {}, // Deixe o update vazio para apenas inserir se não existir
          create: {
            usr_id: member.usr_id,
            inv_document_id: member.inv_document_id,
          },
        })
      }),
    )

    return 'SUCCESS'
  } catch (error) {
    console.error('Erro ao atualizar equipe:', error)
    return 'UPDATE_ERROR'
  } finally {
    await prisma.$disconnect()
  }
}

export const team = {
  findTeamMember,
  createTeam,
  editTeam,
  updateTeam,
}

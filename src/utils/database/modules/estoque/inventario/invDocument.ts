import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

/// ////////////////////////////////////////////////////////////////////
/// ///////////////// CRIAR UM NOVO INVENTÁRIO /////////////////////////
/// ////////////////////////////////////////////////////////////////////

export interface InvDocumentProps {
  documento: string
  status: 'I' | 'E'
  armazem: string
  usrId: number
  dtIni: string
}

async function createInvDocument(data: InvDocumentProps) {
  const { documento, status, armazem, usrId, dtIni } = data

  try {
    // Verificar se já existe um registro com as mesmas propriedades
    const existingDocument = await prisma.inv_document.findFirst({
      where: {
        documento,
        armazem,
        dt_ini: dtIni,
      },
    })

    // Verificar se existe algum documento com status 'Iniciado'
    const anyStartedDocument = await prisma.inv_document.findFirst({
      where: {
        status: 'I',
      },
    })

    if (anyStartedDocument) {
      console.error('Não é possível criar o documento: já existe um documento com status "Iniciado".')
      return 'DOCUMENT STARTED'
    }

    if (!existingDocument) {
      // Se não existir, insere o novo registro
      const newDocument = await prisma.inv_document.create({
        data: {
          documento,
          status,
          armazem,
          usr_id_ini: usrId,
          dt_ini: dtIni,
        },
      })

      return newDocument.id
    } else {
      console.error('Conflito ao criar documento: documento já existe com os mesmos dados.')
      return 'DOCUMENT ALREADY EXISTS'
    }
  } catch (error) {
    console.error('Erro ao criar documento:', error)
  } finally {
    await prisma.$disconnect()
  }
}

/// //////////////////////////////////////////////////////////////////////////
/// ///////////////// VERIFCIAR STATUS DO INVENTARIO /////////////////////////
/// //////////////////////////////////////////////////////////////////////////

async function verifyStatus() {
  const status = await prisma.inv_document.findFirst({
    cacheStrategy: {
      ttl: 10,
    },
    where: {
      status: 'I',
    },
    select: {
      documento: true,
      armazem: true,
    },
  })

  return status
}

export interface CloseInvProps {
  status: 'E'
  usrId: number
  dtFim: string
  document: string
}

export enum ResultErrors {
  NOT_FOUND = 'DOCUMENT_NOT_FOUND',
  VALIDATION = 'INVALID_DATA',
}

/// ////////////////////////////////////////////////////////////////////
/// //////////////////// ENCERRAR INVENTÁRIO ///////////////////////////
/// ////////////////////////////////////////////////////////////////////

async function closeInvDocument(data: CloseInvProps): Promise<ResultErrors | void> {
  if (!data || !data.document || !data.usrId || !data.dtFim) {
    return ResultErrors.VALIDATION
  }
  try {
    const idDocument = await prisma.inv_document.findFirst({
      where: {
        documento: data.document,
        status: 'I',
      },
      select: {
        id: true,
      },
    })

    if (!idDocument) {
      return ResultErrors.NOT_FOUND
    }

    await prisma.inv_document.update({
      where: {
        id: idDocument.id,
      },
      data: {
        status: data.status,
        usr_id_fim: data.usrId,
        dt_fim: data.dtFim,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
  } finally {
    await prisma.$disconnect()
  }
}

/// ////////////////////////////////////////////////////////////////////
/// //////////////////// ATUALIZAR INVENTÁRIO //////////////////////////
/// ////////////////////////////////////////////////////////////////////

interface UpdateProps {
  document: string
  armaz: string
}

async function updateInvDocument(updateData: UpdateProps): Promise<ResultErrors | void> {
  if (!updateData || !updateData.document || !updateData.armaz) {
    return ResultErrors.VALIDATION
  }

  try {
    const idDocument = await prisma.inv_document.findFirst({
      where: {
        documento: updateData.document,
        status: 'I',
      },
      select: {
        id: true,
      },
    })

    if (!idDocument) {
      return ResultErrors.NOT_FOUND
    }

    await prisma.inv_document.update({
      where: {
        id: idDocument.id,
      },
      data: {
        documento: updateData.document,
        armazem: updateData.armaz,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
  } finally {
    await prisma.$disconnect()
  }
}

/// ////////////////////////////////////////////////////////////////////
/// //////////////////// ATUALIZAR INVENTÁRIO //////////////////////////
/// ////////////////////////////////////////////////////////////////////

// async function findDocument(shelf: string) {
//   if (!shelf) {
//     return ResultErrors.VALIDATION
//   }

//   try{
//     const document = await prisma.inv_document.findFirst({
//       where: {

//       }
//     })
//   } catch (error) {
//     console.error('Erro ao buscar documento:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

export const invDocument = {
  createInvDocument,
  verifyStatus,
  closeInvDocument,
  updateInvDocument,
}

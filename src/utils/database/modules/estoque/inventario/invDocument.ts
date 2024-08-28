import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface InvDocumentProps {
  documento: string
  status: 'Iniciado' | 'Encerrado'
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
        status: 'Iniciado',
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

async function verifyStatus() {
  const status = prisma.inv_document.findFirst({
    where: {
      status: 'Iniciado',
    },
    select: {
      documento: true,
    },
  })

  return status
}

export const invDocument = {
  createInvDocument,
  verifyStatus,
}

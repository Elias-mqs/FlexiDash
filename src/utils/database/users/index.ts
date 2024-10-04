import { PrismaClient } from '@prisma/client'

import { dbSystem } from '../system'

const prisma = new PrismaClient()

interface UserProps {
  usrId?: number
  name: string
  email: string
  username: string
  pass: string
  ativo: boolean
}

interface UserOptionalProps {
  name?: string
  username?: string
  email?: string
  ativo?: boolean
}

const findUserById = async (usrId: number) => {
  const user = await prisma.sis_usuarios.findUnique({
    where: { id: usrId },
  })
  if (!user) {
    return null
  } else {
    return user
  }
}

const findFirstUser = async (criteria: UserOptionalProps): Promise<UserProps | null> => {
  const dataUser = await prisma.sis_usuarios.findFirst({
    where: {
      AND: [
        criteria.name ? { nome: criteria.name } : {},
        criteria.username ? { usuario: criteria.username } : {},
        criteria.email ? { email: criteria.email } : {},
        criteria.ativo ? { ativo: criteria.ativo } : {},
      ],
    },
  })

  if (dataUser) {
    const user = {
      usrId: dataUser.id,
      name: dataUser.nome,
      email: dataUser.email,
      username: dataUser.usuario,
      pass: dataUser.pass,
      ativo: dataUser.ativo,
    }

    return user as UserProps
  }

  return null
}

const findUserCriteria = async (criteria: UserOptionalProps): Promise<UserProps | null> => {
  const dataUser = await prisma.sis_usuarios.findFirst({
    where: {
      OR: [{ email: criteria.email }, { usuario: criteria.username }],
    },
  })

  if (dataUser) {
    const user = {
      usrId: dataUser.id,
      name: dataUser.nome,
      email: dataUser.email,
      username: dataUser.usuario,
      pass: dataUser.pass,
      ativo: dataUser.ativo,
    }

    return user as UserProps
  }

  return null
}

const findAllUsers = async () => {
  const allUsers = await prisma.sis_usuarios.findMany({
    select: {
      id: true,
      nome: true,
      usuario: true,
      email: true,
      ativo: true,
    },
  })

  return allUsers
}

const createUser = async (dataUser: UserProps) => {
  const { id: userId } = await prisma.sis_usuarios.create({
    select: { id: true },
    data: { nome: dataUser.name, email: dataUser.email, usuario: dataUser.username, pass: dataUser.pass, ativo: true },
  })
  return userId
}

type UpdateUserProps = {
  userId: number
  newName?: string
  newEmail?: string
  newUsername?: string
}

const updateUser = async ({ userId, newName, newEmail, newUsername }: UpdateUserProps) => {
  // Verificar se o email ou username são fornecidos
  const existingUserWithEmail = newEmail
    ? await prisma.sis_usuarios.findFirst({
        where: { email: newEmail },
      })
    : null

  const existingUserWithUsername = newUsername
    ? await prisma.sis_usuarios.findFirst({
        where: { usuario: newUsername },
      })
    : null

  // Verifica se o usuário com o email ou username existe e não é o próprio usuário que está sendo atualizado
  if (
    (existingUserWithEmail && existingUserWithEmail.id !== userId) ||
    (existingUserWithUsername && existingUserWithUsername.id !== userId)
  ) {
    throw new Error('Email ou username já estão em uso por outro usuário.')
  }

  // Prepara os dados a serem atualizados
  const updatedData: {
    nome?: string
    email?: string
    usuario?: string
  } = {}

  // Adiciona os campos que foram alterados
  if (newName) updatedData.nome = newName
  if (newEmail) updatedData.email = newEmail
  if (newUsername) updatedData.usuario = newUsername

  // Realiza a atualização do usuário apenas com os campos que foram informados
  const updatedUser = await prisma.sis_usuarios.update({
    where: { id: userId },
    data: updatedData,
  })

  return updatedUser
}

/// ///////////////////////////////////////////////////////////////////////////////////////////
/// //////////////////////// Função principal para criar os acessos ///////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////
type ListsCreateFormProps = {
  listModules: number[]
  listRoutines: number[]
  listResources: {
    id: number
    nome: string
    rotinaId: number
  }[]
}

/// /////////////// Cria todos os acessos iniciais passados no formulario de registro
async function createFirstAccess(userId: number, listsForm: ListsCreateFormProps) {
  // Atribui os módulos ao usuário
  const moduleAccesses = await dbSystem.accessMod.createModuleAccess(userId, listsForm.listModules)

  // Atribui as rotinas aos módulos
  const routineAccesses = await dbSystem.accessRoutine.createRoutineAccess(moduleAccesses, listsForm.listRoutines)

  // Atribui os recursos às rotinas
  await dbSystem.acsResource.createResourceAccess(routineAccesses, listsForm.listResources)
}

/// /////////////// Busca todos as informações de todos os acessos do usuário
async function getUserAccess(userId: number) {
  try {
    const userAccess = await prisma.sis_usuarios.findUnique({
      where: {
        id: userId,
      },
      select: {
        sis_acess_modulo: {
          include: {
            sis_modulos: true, // Módulos acessados pelo usuário
            sis_acess_rotina: {
              include: {
                sis_rotinas: true, // Rotinas acessadas
                sis_acess_recurso: {
                  include: {
                    sis_recurso_rotina: true, // Recursos acessados
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

export const users = {
  findUserById,
  findFirstUser,
  findUserCriteria,
  findAllUsers,
  createUser,
  updateUser,
  createFirstAccess,
  getUserAccess,
}

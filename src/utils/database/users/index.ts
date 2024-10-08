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
  newStatus?: boolean
}

const updateUser = async ({ userId, newName, newEmail, newUsername, newStatus }: UpdateUserProps) => {
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
    ativo?: boolean
  } = {
    ativo: newStatus,
  }

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

/// ////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////////////////////

interface DeleteAccessesProps {
  acsModIds: number[]
  acsRoutIds: number[]
  acsResIds: number[]
}

interface CreateAccessesProps {
  modules: {
    id: number
    nome: string
  }[]
  routines: {
    id: number
    nome: string
    modId: number
  }[]
  resources: {
    id: number
    rotina_id: number
    nome: string
  }[]
}

interface UpdateAccessesProps {
  userId: number
  deleteAccesses: DeleteAccessesProps
  createAccesses: CreateAccessesProps
}

async function updateUserAccesses({ userId, deleteAccesses, createAccesses }: UpdateAccessesProps) {
  /// Primeiro deleta os acessos que não são mais permitidos
  try {
    if (deleteAccesses.acsResIds.length > 0) {
      await prisma.sis_acess_recurso.deleteMany({
        where: {
          id: { in: deleteAccesses.acsResIds },
        },
      })
    }

    if (deleteAccesses.acsRoutIds.length > 0) {
      await prisma.sis_acess_rotina.deleteMany({
        where: {
          id: { in: deleteAccesses.acsRoutIds },
        },
      })
    }

    if (deleteAccesses.acsModIds.length > 0) {
      await prisma.sis_acess_modulo.deleteMany({
        where: {
          id: { in: deleteAccesses.acsModIds },
        },
      })
    }
  } catch (error) {
    console.error('Erro deletando acessos do usuario:', error)
  }

  /// ///////// Criar acessos dos módulos
  if (createAccesses.modules.length > 0) {
    try {
      await prisma.sis_acess_modulo.createMany({
        data: createAccesses.modules.map((mod) => ({
          mod_id: mod.id,
          usr_id: userId,
        })),
      })
    } catch (error) {
      console.error('Erro criando acessos a módulos para usuário:', error)
      throw new Error('Falha criando acessos de módulos')
    }
  }

  /// ///////// Criar acessos das rotinas
  if (createAccesses.routines.length > 0) {
    try {
      /// Primeiro busca os ids dos acessos dos módulos
      const accessModule = await prisma.sis_acess_modulo.findMany({
        where: {
          mod_id: { in: createAccesses.routines.map((modId) => modId.modId) },
          usr_id: userId,
        },
        select: {
          id: true,
          mod_id: true,
        },
      })

      /// Depois cria o acesso das rotinas
      await prisma.sis_acess_rotina.createMany({
        data: createAccesses.routines.map((routine) => {
          const foundModId = accessModule.find((acsMod) => acsMod.mod_id === routine.modId)
          return {
            acess_mod_id: foundModId!.id,
            rotina_id: routine.id,
          }
        }),
      })
    } catch (error) {
      console.error('Erro criando acessos a rotinas para usuário:', error)
      throw new Error('Falha criando acessos de rotinas')
    }
  }

  /// ///////// Criar acessos dos recursos
  if (createAccesses.resources.length > 0) {
    try {
      /// Buscar os acessos das rotinas cadastradas
      const accessRoutine = await prisma.sis_usuarios.findMany({
        where: {
          id: userId,
        },
        select: {
          sis_acess_modulo: {
            select: {
              sis_acess_rotina: {
                select: {
                  id: true,
                  rotina_id: true,
                },
              },
            },
          },
        },
      })

      /// Acessar somente os ids dos acessos de rotinas
      const rotinaIds = accessRoutine.flatMap((usuario) =>
        usuario.sis_acess_modulo.flatMap((modulo) => modulo.sis_acess_rotina.map((rotina) => rotina)),
      )

      /// Depois cria os acessos dos recursos
      await prisma.sis_acess_recurso.createMany({
        data: createAccesses.resources.map((resource) => {
          const foundRoutineId = rotinaIds.find((routine) => routine.rotina_id === resource.rotina_id)

          return {
            acess_rot_id: foundRoutineId!.id,
            rec_rotina_id: resource.id,
          }
        }),
      })
    } catch (error) {
      console.error('Erro criando acessos aos recursos para usuário:', error)
      throw new Error('Falha criando acessos de recursos')
    }
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
  updateUserAccesses,
}

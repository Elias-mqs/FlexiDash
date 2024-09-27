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

const createUser = async (dataUser: UserProps) => {
  const { id: userId } = await prisma.sis_usuarios.create({
    select: { id: true },
    data: { nome: dataUser.name, email: dataUser.email, usuario: dataUser.username, pass: dataUser.pass, ativo: true },
  })
  return userId
}

type ListsFormProps = {
  listModules: number[]
  listRoutines: number[]
  // listResources: number[]
  listResources: {
    id: number
    nome: string
    modId?: number | undefined
    rotinaId?: number | undefined
  }[]
}

// Função principal para criar os acessos
async function createFirstAccess(userId: number, listsForm: ListsFormProps) {
  // 2. Atribuir os módulos ao usuário
  const moduleAccesses = await dbSystem.accessMod.createModuleAccess(userId, listsForm.listModules)

  // 3. Atribuir as rotinas aos módulos
  const routineAccesses = await dbSystem.accessRoutine.createRoutineAccess(moduleAccesses, listsForm.listRoutines)

  // 4. Atribuir os recursos às rotinas
  await dbSystem.acsResource.createResourceAccess(routineAccesses, listsForm.listResources)
}

export const users = {
  findUserById,
  findFirstUser,
  findUserCriteria,
  createUser,
  createFirstAccess,
}

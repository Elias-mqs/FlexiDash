import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findUserById = async (usrId: number) => {
  const user = await prisma.sis_usuarios.findUnique({
    where: { id: usrId },
  })
  return user
}

interface UserProps {
  usrId: number
  name: string
  email: string
  username: string
  pass: string
  ativo: boolean
}

const findFirstUser = async (criteria: {
  name?: string
  username?: string
  email?: string
  ativo?: boolean
}): Promise<UserProps | null> => {
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

    return user
  }

  return null
}

const createUser = async (dataUser: {
  name: string
  username: string
  pass: string
  email: string
  ativo: boolean
}) => {
  await prisma.sis_usuarios.create({
    data: {
      nome: dataUser.name,
      email: dataUser.email,
      usuario: dataUser.username,
      pass: dataUser.pass,
      ativo: true,
    },
  })
}

export const users = {
  findUserById,
  findFirstUser,
  createUser,
}

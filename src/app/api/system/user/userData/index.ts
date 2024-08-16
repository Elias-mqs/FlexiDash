import { JwtService } from '@/services'
import { db } from '@/utils/database'

interface DataUserProps {
  id: number
  nome: string
  usuario: string
  email: string
  pass: string
  ativo: boolean
}

export async function srcUser(token: string): Promise<DataUserProps | { message: string; status: number }> {
  try {
    const decoded = JwtService.verify(token)

    if (decoded === 'JWT_SECRET_NOT_FOUND') {
      throw new Error('JWT_SECRET_NOT_FOUND')
    }
    if (decoded === 'INVALID_TOKEN') {
      throw new Error('INVALID_TOKEN')
    }

    const dataUser = await db.users.findUserById(decoded.usrId)

    if (dataUser === null) {
      throw new Error('Erro ao buscar usuário')
    }

    return dataUser
  } catch (error) {
    console.log(error)
    return { message: 'Erro interno', status: 500 }
  }
}

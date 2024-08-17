import { JwtService } from '@/services'
import { db } from '@/utils/database'

export async function srcUser(token: string) {
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
      return null
    }

    return dataUser
  } catch (error) {
    console.error('Error in srcUser:', error)
    throw error
  }
}

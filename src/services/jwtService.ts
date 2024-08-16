import * as jwt from 'jsonwebtoken'

interface JwtProps {
  usrId: number
}

const signIn = (data: JwtProps): string | 'JWT_SECRET_NOT_FOUND' => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30m' })
}

const verify = (token: string): JwtProps | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (typeof decoded === 'string') {
      return 'INVALID_TOKEN'
    }

    return decoded as JwtProps
  } catch (error) {
    return 'INVALID_TOKEN'
  }
}

export const JwtService = {
  signIn,
  verify,
}

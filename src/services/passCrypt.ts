import { genSalt, hash, compare } from 'bcryptjs'

async function hashPassword(pass: string): Promise<string> {
  const saltRounds = 10
  try {
    const salt = await genSalt(saltRounds)
    return await hash(pass, salt)
  } catch (error) {
    console.error('Erro ao hashear a senha:', error)
    throw error
  }
}

async function verifyPassword(pass: string, hashedPass: string): Promise<boolean> {
  if (!pass || !hashedPass) {
    throw new Error('Senha e hash são obrigatórios')
  }

  try {
    const match = await compare(pass, hashedPass)
    return match
  } catch (error) {
    console.error('Erro ao comparar senhas:', error)
    throw error
  }
}

export const PassCrypt = {
  hashPassword,
  verifyPassword,
}

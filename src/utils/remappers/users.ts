interface UserProps {
  name?: string
  username?: string
  email?: string
  pass?: string
  ativo?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function srcUser(user: UserProps): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {}

  if (user.name !== undefined) {
    result.usr_name = user.name
  }
  if (user.username !== undefined) {
    result.usr_username = user.username
  }
  if (user.email !== undefined) {
    result.usr_email = user.email
  }
  if (user.pass !== undefined) {
    result.usr_pass = user.pass
  }
  if (user.ativo !== undefined) {
    result.usr_ativo = user.ativo
  }

  return result
}

function userById({ usrId }: { usrId: number }) {
  return { usr_id: usrId }
}

interface CreateUserProps {
  name: string
  username: string
  email: string
  pass: string
  ativo: boolean
}

function createUser(user: CreateUserProps) {
  return {
    usr_name: user.name,
    usr_username: user.username,
    usr_email: user.email,
    usr_pass: user.pass,
    usr_ativo: user.ativo,
  }
}

export const remapUsers = {
  srcUser,
  userById,
  createUser,
}

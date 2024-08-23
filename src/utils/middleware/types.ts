export interface AuthProps {
  valid: boolean
  user: {
    usrId: number
    iat: number
    exp: number
  }
  error: string
  message: string
  status: number
}

export interface ListModulesProps {
  sis_modulos: {
    slug: string
  }
}

export interface ListRoutinesProps {
  sis_rotinas: {
    slug: string
  }
}

export interface ListResourceProps {
  sis_recurso_rotina: {
    slug: string
  }
}

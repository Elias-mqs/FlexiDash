interface SisRecursoRotina {
  id: number
  rotina_id: number
  nome: string
  slug: string
}

interface SisAcessRecurso {
  id: number
  acess_rot_id: number
  rec_rotina_id: number
  sis_recurso_rotina: SisRecursoRotina
}

interface SisRotinas {
  id: number
  mod_id: number
  nome: string
  slug: string
}

interface SisAcessRotina {
  id: number
  acess_mod_id: number
  rotina_id: number
  sis_rotinas: SisRotinas
  sis_acess_recurso: SisAcessRecurso[]
}

interface SisModulos {
  id: number
  nome: string
  slug: string
}

interface SisAcessModulo {
  id: number
  usr_id: number
  mod_id: number
  sis_modulos: SisModulos
  sis_acess_rotina: SisAcessRotina[]
}

export interface UserAccessProps {
  sis_acess_modulo: SisAcessModulo[]
}

import { z } from 'zod'

// Schema para SisRecursoRotina
const SisRecursoRotinaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  rotina_id: z.number(),
})

// Schema para SisRotina
const SisRotinaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  mod_id: z.number(),
  sis_recurso_rotina: z.array(SisRecursoRotinaSchema),
})

// Schema para FeaturesListProps
const userAccessPropsSchema = z.object({
  id: z.number(),
  nome: z.string(),
  sis_rotinas: z.array(SisRotinaSchema),
})

export { userAccessPropsSchema }

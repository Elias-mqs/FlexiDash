import { NextResponse } from 'next/server'

import { dbSystem } from '@/utils/database/system'

interface SisRecursoRotina {
  id: number
  nome: string
  rotina_id: number
}

interface SisRotina {
  id: number
  nome: string
  mod_id: number
  sis_recurso_rotina: SisRecursoRotina[]
}

export interface FeaturesListProps {
  id: number
  nome: string
  sis_rotinas: SisRotina[]
}

export async function GET() {
  const featuresList: FeaturesListProps[] = await dbSystem.findAllFeatures()

  return NextResponse.json({ featuresList }, { status: 200 })
}

import { NextResponse, type NextRequest } from 'next/server'

import { dbSystem } from '@/utils/database/system'

export async function POST(request: NextRequest) {
  const { modules: listModules }: { modules: number[] } = await request.json()

  if (!listModules || listModules.length < 1) {
    return NextResponse.json({ message: 'Dados invalidos. Tente novamente ou contate a TI' }, { status: 400 })
  }

  try {
    const listRoutines = await dbSystem.routines.findManyRoutines(listModules)

    if (!listRoutines || listRoutines.length < 1) {
      throw Error('Erro na busca listRoutines')
    }

    return NextResponse.json({ listRoutines }, { status: 200 })
  } catch (error) {
    console.error('Erro na list-routines-user', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

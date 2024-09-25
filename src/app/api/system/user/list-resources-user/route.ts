import { NextResponse, type NextRequest } from 'next/server'

import { dbSystem } from '@/utils/database/system'

export async function POST(request: NextRequest) {
  const { routines: listRoutines }: { routines: number[] } = await request.json()

  if (!listRoutines || listRoutines.length < 1) {
    return NextResponse.json({ message: 'Dados invalidos. Tente novamente ou contate a TI' }, { status: 400 })
  }

  try {
    const listResources = await dbSystem.resourceRoutine.findManyResources(listRoutines)

    if (!listResources || listResources.length < 1) {
      throw Error('Erro na busca listResources')
    }

    return NextResponse.json({ listResources }, { status: 200 })
  } catch (error) {
    console.error('Erro na list-resources-user', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

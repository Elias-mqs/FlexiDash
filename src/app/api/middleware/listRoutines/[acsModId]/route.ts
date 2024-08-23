import { NextResponse } from 'next/server'

import { dbSystem } from '@/utils/database/system'

type ParamsProps = {
  acsModId: number
}
export async function GET(request: Request, context: { params: ParamsProps }) {
  const acsModId = context.params.acsModId

  if (!acsModId) {
    return NextResponse.json({ message: 'informação do acsModId inválida' }, { status: 400 })
  }

  try {
    const listRoutine = await dbSystem.accessRoutine.listRoutine(Number(acsModId))

    return NextResponse.json(listRoutine, { status: 200 })
  } catch (error) {
    console.error('Erro no listRoutines da api do middleware', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

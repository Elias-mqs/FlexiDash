import { NextResponse } from 'next/server'

import { dbSystem } from '@/utils/database/system'

type ParamsProps = {
  usrId: number
}
export async function GET(request: Request, context: { params: ParamsProps }) {
  const usrId = context.params.usrId

  if (!usrId) {
    return NextResponse.json({ message: 'informação do usrId inválida' }, { status: 400 })
  }

  try {
    const listModules = await dbSystem.accessMod.listModules(Number(usrId))

    return NextResponse.json(listModules, { status: 200 })
  } catch (error) {
    console.error('Erro no listModules da api do middleware', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

import { dbSystem } from '@/utils/database/system'

type ParamsProps = {
  acsRtnId: number
}
export async function GET(request: Request, context: { params: ParamsProps }) {
  const acsRtnId = context.params.acsRtnId

  if (!acsRtnId) {
    return NextResponse.json({ message: 'informação do acsRtnId inválida' }, { status: 400 })
  }

  try {
    const listResource = await dbSystem.acsResource.listResource(Number(acsRtnId))

    return NextResponse.json(listResource, { status: 200 })
  } catch (error) {
    console.error('Erro no listResource da api do middleware', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

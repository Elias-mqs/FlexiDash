import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function GET(request: NextRequest) {
  const req = request.nextUrl.searchParams
  console.log('GET verifyStatus: ', req)

  try {
    const hasStartedInventory = await dbInventory.invDocument.verifyStatus()

    if (hasStartedInventory === null) {
      return NextResponse.json({ status: false }, { status: 200 })
    }

    return NextResponse.json(
      { status: true, document: hasStartedInventory.documento, armaz: hasStartedInventory.armazem },
      { status: 200 },
    )
  } catch (error) {
    console.error('Erro no verifyStatus', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

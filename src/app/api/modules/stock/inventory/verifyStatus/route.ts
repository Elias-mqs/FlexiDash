import { NextResponse } from 'next/server'

import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function GET() {
  try {
    const hasStartedInventory = await dbInventory.invDocument.verifyStatus()

    if (hasStartedInventory !== null) {
      return NextResponse.json({ status: true, document: hasStartedInventory.documento }, { status: 200 })
    }

    return NextResponse.json({ status: false }, { status: 200 })
  } catch (error) {
    console.error('Erro no verifyStatus', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

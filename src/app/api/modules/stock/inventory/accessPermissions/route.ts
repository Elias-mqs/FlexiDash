import { NextResponse, type NextRequest } from 'next/server'

import { type ListResourceProps } from '@/context/SystemLists/AccessUserContext'
import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function POST(request: NextRequest) {
  const data = await request.json()

  const { dataList: inventoryResources }: { dataList: ListResourceProps[] } = FormsCrypt.verifyData(data)

  const inventoryDocument = inventoryResources.find((resource) => resource.sis_recurso_rotina.id === 1)

  try {
    const verifyStatus = await dbInventory.invDocument.verifyStatus()

    if (verifyStatus === null) {
      const secureRes = FormsCrypt.dataCrypt({
        listResourceInventory: [inventoryDocument],
        status: 'Inventário não iniciado',
      })

      return NextResponse.json(secureRes, { status: 200 })
    }

    const secureRes = FormsCrypt.dataCrypt({
      listResourceInventory: inventoryResources,
      status: 'Inventario iniciado',
    })

    return NextResponse.json(secureRes, { status: 200 })
  } catch (error) {
    console.error('Erro no accessPermissions', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

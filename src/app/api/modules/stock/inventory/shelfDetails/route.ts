import { NextResponse, type NextRequest } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

type ShelfDetailsFetchProps = {
  detalhesPrat: {
    codProd: string
    descProd: string
    qtdAtual: number
  }[]
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const descPra = await FormsCrypt.verifyData(data)

  if (!descPra) {
    return NextResponse.json({ message: 'Dados mal informados ou inexistentes' }, { status: 400 })
  }

  try {
    const inventoryData = await dbInventory.invDocument.verifyStatus()

    if (!inventoryData) {
      throw new Error('Erro ao buscar dados do inventário')
    }

    const { armazem } = inventoryData

    const urlApi = process.env.ENDPOINT_SHELF_DETAILS

    const response = await fetch(`${urlApi}cPrat=${descPra}&cArmaz=${armazem}`, {
      method: 'GET',
      cache: 'force-cache',
      // next: { revalidate: 3600 },
    })

    const { detalhesPrat: shelfDetails }: ShelfDetailsFetchProps = await response.json()

    if (!shelfDetails) {
      return NextResponse.json({ message: 'Sem dados na prateleira' }, { status: 200 })
    }

    const responseCrypt = FormsCrypt.dataCrypt(shelfDetails)

    return NextResponse.json(responseCrypt, { status: 200 })
  } catch (error) {
    console.error('Erro no getTeamMember', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

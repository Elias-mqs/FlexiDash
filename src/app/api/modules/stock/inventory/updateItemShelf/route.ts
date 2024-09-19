import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

interface RequestProps {
  qtdCount: number
  newRegister: boolean
  codProd: string
}

interface ResSqlErrorProps {
  errorCode: number
  errorMessage: string
}

interface ResSqlSuccessProps {
  message: string
  successCode: number
}

export async function POST(request: NextRequest) {
  const req = await request.json()
  const { qtdCount, newRegister, codProd }: RequestProps = FormsCrypt.verifyData(req)
  const urlApi = process.env.ENDPOINT_UPDATE_INVENTORY

  if (!qtdCount || !codProd) {
    return NextResponse.json({ message: 'Dados mal informados ou inexistentes' }, { status: 400 })
  }

  console.log(req)

  console.log('newRegister:', newRegister ? 'S' : 'N')

  try {
    const inventoryData = await dbInventory.invDocument.verifyStatus()

    if (!inventoryData) {
      throw new Error('Erro ao buscar dados do inventário')
    }

    const { armazem, documento, dt_ini: dtIni } = inventoryData

    console.log('qtdCount:', qtdCount)
    console.log('codProd:', codProd)
    console.log('armazem:', armazem)
    console.log('documento:', documento)
    console.log('novo registro:', newRegister ? 'S' : 'N')
    console.log('date:', formatDate(dtIni))

    const fetchInventory = await fetch(`${urlApi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tem que definir o content type (principalemente no POST)
      },
      body: JSON.stringify({
        nQtdProd: qtdCount,
        cCodProd: codProd, // Convertendo o objeto para JSON
        cArmaz: armazem,
        cDocument: documento,
        cInsert: newRegister ? 'S' : 'N',
        cDate: formatDate(dtIni),
        cFilial: '01',
      }),
    })

    const response: ResSqlSuccessProps | ResSqlErrorProps = await fetchInventory.json()

    console.log(response)

    if ('errorCode' in response) {
      throw Error('Erro no fetch addRegisterInventory')
    }

    return NextResponse.json({ message: 'Sucesso na requisição' }, { status: 200 })
  } catch (error) {
    console.error('Erro no updateItemShelf', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

const formatDate = (date: string): string => {
  const [day, month, year] = date.split('/')
  return `${year}${month}${day}`
}

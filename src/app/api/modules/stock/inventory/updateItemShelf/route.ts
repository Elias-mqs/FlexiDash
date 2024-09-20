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

  const urlApi = process.env.ENDPOINT_UPDATE_INVENTORY

  const { qtdCount, newRegister, codProd }: RequestProps = FormsCrypt.verifyData(req)

  if ((!qtdCount && qtdCount !== 0) || !codProd) {
    return NextResponse.json({ message: 'Dados mal informados ou inexistentes' }, { status: 400 })
  }

  try {
    const inventoryData = await dbInventory.invDocument.verifyStatus()

    if (!inventoryData) {
      throw new Error('Erro ao buscar dados do inventário')
    }

    const { armazem, documento, dt_ini: dtIni } = inventoryData

    /// ///////////////////////// Atualiza/Insere o item na SB7 /////////////////////////////
    const fetchInventory = await fetch(`${urlApi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tem que definir o content type (principalemente no POST)
      },
      body: JSON.stringify({
        nQtdProd: qtdCount,
        cCodProd: codProd,
        cArmaz: armazem,
        cDocument: documento,
        cInsert: newRegister ? 'S' : 'N',
        cDate: formatDate(dtIni),
        cFilial: '01',
      }),
    })

    const response: ResSqlSuccessProps | ResSqlErrorProps = await fetchInventory.json()

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

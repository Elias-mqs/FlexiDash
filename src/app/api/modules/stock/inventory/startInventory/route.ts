import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'
import { InvDocumentProps } from '@/utils/database/modules/estoque/inventario/invDocument'

interface StartNewInventory {
  document: string
  armaz: string
  teamMemberId: number[]
  usrId: number
}

export async function POST(request: Request) {
  const form = await request.json()
  const inventoryData: StartNewInventory = FormsCrypt.verifyData(form)

  const formattedDate = dayjs().format('DD/MM/YYYY')

  try {
    const formInvDocument: InvDocumentProps = {
      documento: inventoryData.document,
      status: 'I',
      armazem: inventoryData.armaz,
      usrId: inventoryData.usrId,
      dtIni: formattedDate,
    }

    const newInventory = await dbInventory.invDocument.createInvDocument(formInvDocument)

    if (newInventory === 'DOCUMENT STARTED') {
      return NextResponse.json({ message: 'Inventário já iniciado' }, { status: 401 })
    }

    if (newInventory === 'DOCUMENT ALREADY EXISTS') {
      return NextResponse.json(
        { title: 'Inventario já criado', message: 'informe outro documento ou armazém' },
        { status: 400 },
      )
    }

    if (!newInventory) {
      throw new Error('Erro ao criar inventario')
    }

    await dbInventory.team.createTeam(inventoryData.teamMemberId, newInventory)

    return NextResponse.json({ message: 'Tudo certo' }, { status: 201 })
  } catch (error) {
    console.error('Erro interno no startInventory', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

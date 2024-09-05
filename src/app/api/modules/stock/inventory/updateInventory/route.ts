import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { UpdateInvProps } from '@/components/ui/Modules/Estoque/Inventario/EditDocument'
import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const { document, armaz, teamMemberId }: UpdateInvProps = FormsCrypt.verifyData(data)

  if (!document || !armaz) {
    return NextResponse.json({ message: 'Informações inválidas, tente novamente' }, { status: 400 })
  }

  if (teamMemberId.length < 1) {
    throw new Error('Erro no teamMemberId')
  }

  try {
    const updateInvResponse = await dbInventory.invDocument.updateInvDocument({ document, armaz })

    if (updateInvResponse === 'DOCUMENT_NOT_FOUND' || updateInvResponse === 'INVALID_DATA') {
      console.error('Erro no updateInvResponse')
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }

    const updateTeamResponse = await dbInventory.team.updateTeam(teamMemberId, document)

    const updateTeamErrors = ['DATA_ERROR', 'DOCUMENT_NOT_FOUND', 'UPDATE_ERROR']

    if (updateTeamErrors.includes(updateTeamResponse)) {
      console.error('Erro no updateTeamResponse')
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Inventário atualizado com sucesso' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

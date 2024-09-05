import dayjs from 'dayjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const { document, armaz }: { document: string; armaz: string } = FormsCrypt.verifyData(data)

  const dateNow = dayjs().format('DD/MM/YYYY')

  if (!document || !armaz) {
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }

  const cookieRtn = cookies().get('acsRtnData')?.value

  if (!cookieRtn) {
    console.error('Erro no cookieRtn')
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }

  const { routineId } = FormsCrypt.verifyData({ data: cookieRtn })

  try {
    const participants = await dbInventory.team.editTeam(document, armaz, dateNow)

    if (participants === 'ERROR_FIND_DOCUMENTID' || participants === 'ERROR_FIND_AVAILABLE_MEMBERS') {
      console.error('Erro no editTeam')
      return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
    }

    const allowedMembers = await dbInventory.team.findTeamMember(routineId)

    const { data } = FormsCrypt.dataCrypt({ allowedMembers, participants })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Erro no getTeamMember', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

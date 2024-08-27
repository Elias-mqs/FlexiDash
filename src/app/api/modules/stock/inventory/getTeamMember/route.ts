import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

export async function GET() {
  const cookieRtn = cookies().get('acsRtnData')?.value

  if (!cookieRtn) {
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }

  const { routineId } = FormsCrypt.verifyData({ data: cookieRtn })

  try {
    const teamMembers = await dbInventory.team.findTeamMember(routineId)

    const { data } = FormsCrypt.dataCrypt(teamMembers)

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Erro no getTeamMember', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

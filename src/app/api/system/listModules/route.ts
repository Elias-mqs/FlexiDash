import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbSystem } from '@/utils/database/system'

import { srcUser } from '../user/userData'

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (token === ('' || undefined)) {
    return NextResponse.json({ message: 'Token invalido ou expirado' }, { status: 401 })
  }

  try {
    const dataUser = await srcUser(token)
    console.log(dataUser)

    if (!dataUser) {
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }
    const modulesList = await dbSystem.accessMod.findAcsMod({ usrId: dataUser.id })

    if (modulesList === null) {
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }

    console.log(modulesList)

    const data = FormsCrypt.dataCrypt(modulesList)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

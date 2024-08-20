import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { srcUser } from '@/app/api/system/user/userData'
import { FormsCrypt } from '@/services'
import { dbSystem } from '@/utils/database/system'

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (token === ('' || undefined)) {
    return NextResponse.json({ message: 'Token invalido ou expirado' }, { status: 401 })
  }

  try {
    const dataUser = await srcUser(token)

    if (!dataUser) {
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }
    const modulesList = await dbSystem.accessMod.findAcsMod({ usrId: dataUser.id })

    if (modulesList === null || modulesList.length < 1) {
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }

    const hasAcsModId = cookies().has('acsModData')

    if (hasAcsModId) {
      cookies().delete('acsModData')
    }

    const data = FormsCrypt.dataCrypt(modulesList)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error listModules', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

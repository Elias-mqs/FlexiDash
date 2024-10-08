import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'

import { srcUser } from '../userData'

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: 'Token invalido ou expirado' }, { status: 401 })
  }

  try {
    const dataUser = await srcUser(token)

    if (!dataUser) {
      return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pass, ...dataUserRemap } = dataUser

    const data = FormsCrypt.dataCrypt(dataUserRemap)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error userDataRoutes', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

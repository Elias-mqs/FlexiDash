import { NextResponse, type NextRequest } from 'next/server'

import { FormsCrypt } from '@/services'
import { db } from '@/utils/database'

import { UserAccessProps } from './types'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const { userId }: { userId: number } = FormsCrypt.verifyData(data)

  if (typeof userId !== 'number' || userId <= 0) throw new Error('Dados mal informados')

  try {
    const userAccess: UserAccessProps | null = await db.users.getUserAccess(userId)

    if (!userAccess) throw new Error('Erro na busca dos acessos do usuário')

    return NextResponse.json(userAccess, { status: 200 })
  } catch (error) {
    console.error('Erro no get-list-access:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

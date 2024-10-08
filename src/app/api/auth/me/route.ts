import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { JwtService } from '@/services'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  const prisma = new PrismaClient()

  if (token === '') {
    return NextResponse.json({ error: 'Token não disponivel', valid: false }, { status: 401 })
  }

  try {
    const decoded = JwtService.verify(token!)

    if (decoded === 'INVALID_TOKEN' || decoded === 'JWT_SECRET_NOT_FOUND') {
      return NextResponse.json({ valid: false, message: 'Token invalido ou expirado' })
    }

    const dataUser = await prisma.sis_usuarios.findUnique({
      where: {
        id: decoded.usrId,
      },
      select: {
        ativo: true,
      },
    })

    if (!dataUser) {
      return NextResponse.json({ valid: false, message: 'Problema ao consultar usuário no route auth me' })
    }

    if (dataUser.ativo === false) {
      return NextResponse.json({ valid: false, message: 'Usuário está com a conta inativa' })
    }

    return NextResponse.json({ valid: true, user: decoded })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

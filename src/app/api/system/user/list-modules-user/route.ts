import { NextResponse } from 'next/server'

import { dbSystem } from '@/utils/database/system'

export async function GET() {
  try {
    const listModules = await dbSystem.modules.findAllModules()
    return NextResponse.json({ listModules }, { status: 200 })
  } catch (error) {
    console.error('Erro interno na list-modules-user: ', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

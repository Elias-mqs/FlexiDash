import { NextResponse, type NextRequest } from 'next/server'

import { dbSystem } from '@/utils/database/system'

export async function POST(request: NextRequest) {
  const req = await request.json()
  console.log(req)
  const findModules = await dbSystem.modules.findAllModules()

  console.log(findModules)

  return NextResponse.json({ message: 'tudo certo' }, { status: 200 })
}

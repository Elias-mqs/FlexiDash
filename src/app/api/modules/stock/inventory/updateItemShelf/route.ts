import { FormsCrypt } from '@/services'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const req = await request.json()
  const dataItem = FormsCrypt.verifyData(req)
  console.log(req)
  console.log(dataItem)

  return NextResponse.json({ message: 'tudo certo' }, { status: 200 })
}

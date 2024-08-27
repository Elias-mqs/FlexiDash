import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'

interface StartNewInventory {
  document: string
  armaz: string
  teamMemberId: number[]
}

export async function POST(request: Request) {
  const form = await request.json()
  console.log(form)
  const inventoryData: StartNewInventory = FormsCrypt.verifyData(form)
  console.log(inventoryData)

  return NextResponse.json({ message: 'tudo certo' }, { status: 201 })
}

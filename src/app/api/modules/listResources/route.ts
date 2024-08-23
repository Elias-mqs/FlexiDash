import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbSystem } from '@/utils/database/system'

export async function POST(request: Request) {
  const data: { data: string; usrId: number } = await request.json()

  const { acsRtnId, routineId } = FormsCrypt.verifyData(data)

  if (!routineId || !acsRtnId) {
    return NextResponse.json({ message: 'Rotina não encontrada, contate a TI' }, { status: 404 })
  }
  if (!data.usrId) return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })

  try {
    const resourceList = await dbSystem.acsResource.findAcsResource({ acsRtnId })

    if (!resourceList || resourceList.length < 1) {
      return NextResponse.json({ message: 'Recursos não encontrados, contate a TI' }, { status: 404 })
    }

    const secureList = FormsCrypt.dataCrypt(resourceList)

    return NextResponse.json(secureList, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

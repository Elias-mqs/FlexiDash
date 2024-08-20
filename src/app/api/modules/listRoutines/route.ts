import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbSystem } from '@/utils/database/system'

export async function POST(request: Request) {
  const data: { data: string; usrId: number } = await request.json()
  const {
    data: { modId, acsModId },
  } = FormsCrypt.verifyData(data)

  if (!modId || !acsModId) return NextResponse.json({ message: 'Módulo não encontrado, contate a TI' }, { status: 404 })
  if (!data.usrId) return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })

  try {
    const routinesList = await dbSystem.accessRoutine.findAcsRoutine({ acsModId })

    if (!routinesList || routinesList.length < 1) {
      return NextResponse.json({ message: 'Rotinas não encontradas, contate a TI' }, { status: 404 })
    }

    const secureList = FormsCrypt.dataCrypt(routinesList)

    return NextResponse.json(secureList, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

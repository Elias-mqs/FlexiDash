import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbSystem } from '@/utils/database/system'

interface FormDataProps {
  module: string
  usrId: number
  acsModId: number
  mod_id: number
}

export async function POST(request: Request) {
  const formData = await request.json()
  const data: FormDataProps = FormsCrypt.verifyData(formData)

  if (!data.module) return NextResponse.json({ message: 'Módulo não encontrado, contate a TI' }, { status: 404 })
  if (!data.usrId || !data.acsModId || !data.mod_id) {
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }

  try {
    const routinesList = await dbSystem.accessRoutine.findAcsRoutine({ acsModId: data.acsModId })

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

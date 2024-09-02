import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'
import { CloseInvProps } from '@/utils/database/modules/estoque/inventario/invDocument'

export async function POST(request: Request) {
  const data = await request.json()

  if (!data) {
    return NextResponse.json({ message: 'Erro 400 - Dados inválidos' }, { status: 400 })
  }

  const { document, userId }: { document: string; userId: number } = FormsCrypt.verifyData(data)

  // Validação de tipo e conteúdo
  if (typeof document !== 'string' || document.trim() === '') {
    return NextResponse.json({ message: 'Erro 400 - Documento inválido' }, { status: 400 })
  }

  if (typeof userId !== 'number' || isNaN(userId) || userId <= 0) {
    return NextResponse.json({ message: 'Erro 400 - ID de usuário inválido' }, { status: 400 })
  }

  const updateForm: CloseInvProps = {
    status: 'E',
    dtFim: dayjs().format('DD/MM/YYYY'),
    usrId: userId,
    document,
  }

  try {
    const updatedInv = await dbInventory.invDocument.closeInvDocument(updateForm)

    if (updatedInv) {
      throw new Error(updatedInv)
    }

    return NextResponse.json({ message: 'Inventário encerrado' }, { status: 200 })
  } catch (error) {
    console.error('Erro interno no closeInventory', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

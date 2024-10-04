import { NextResponse } from 'next/server'
import { z } from 'zod'

import { FormsCrypt } from '@/services'
import { db } from '@/utils/database'

/// Schema de validação
const userFormSchema = z.object({
  userId: z.number(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  username: z.string().min(1, 'Nome de usuário é obrigatório'),
  listModules: z.array(z.number()).min(1, 'Pelo menos um módulo deve ser selecionado'),
  listRoutines: z
    .array(
      z.object({
        id: z.number(),
        nome: z.string(),
        modId: z.number(),
      }),
    )
    .min(1, 'Pelo menos uma routina deve ser selecionado'),
  listResources: z
    .array(
      z.object({
        id: z.number(),
        nome: z.string(),
        rotinaId: z.number(),
      }),
    )
    .min(1, 'Pelo menos um recurso deve ser selecionado'),
})

export async function POST(request: Request) {
  const data = await request.json()

  const formData = FormsCrypt.verifyData(data)

  // Validação com Zod
  const parseResult = userFormSchema.safeParse(formData)

  console.log('parseResult:', parseResult)
  console.log('listResources:', parseResult.data?.listResources)

  if (!parseResult.success) {
    return NextResponse.json({ message: 'Dados mal informados, verifique e tente novamente' }, { status: 400 })
  }

  // Dados já validados e tipados
  const userForm = parseResult.data

  console.log('userForm: ', userForm)

  try {
    /// Busca os dados antigos do usuário
    const oldDbUserData = await db.users.findUserById(userForm.userId)

    if (!oldDbUserData) {
      return NextResponse.json(
        { message: 'Usuário inválido, tente acessar novamente ou contate a TI' },
        { status: 400 },
      )
    }

    /// Prepara os dados que serão atualizados
    const prepareDataUpdate = {
      userId: oldDbUserData.id,
      newName: oldDbUserData.nome !== userForm.name ? userForm.name : undefined,
      newEmail: oldDbUserData.email !== userForm.email ? userForm.email : undefined,
      newUsername: oldDbUserData.usuario !== userForm.username ? userForm.username : undefined,
    }

    /// Atualiza e retorna os dados atualizados
    const updatedUser = await db.users.updateUser(prepareDataUpdate)

    console.log('updatedUser:', updatedUser)

    /// Prepara a lista de acessos que serão atualizados
    const prepareListForm = {
      listModules: userForm.listModules,
      listRoutines: userForm.listRoutines,
      listResources: userForm.listResources,
    }

    console.log(prepareListForm)

    return NextResponse.json({ message: 'Usuário atualizado com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

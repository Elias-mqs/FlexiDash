import { NextResponse } from 'next/server'
import { z } from 'zod'

import { FormsCrypt, PassCrypt } from '@/services'
import { emailServices } from '@/services/email'
import { utils } from '@/utils/actions/generateRandomPass'
import { db } from '@/utils/database'

const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  username: z.string().min(1, 'Nome de usuário é obrigatório'),
  listModules: z.array(z.number()).min(1, 'Pelo menos um módulo deve ser selecionado'),
  listRoutines: z.array(z.number()).min(1, 'Pelo menos uma rotina deve ser selecionada'),
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

  if (!parseResult.success) {
    return NextResponse.json({ message: 'Dados mal informados, verifique e tente novamente' }, { status: 400 })
  }

  // Dados já validados e tipados
  const userForm = parseResult.data

  try {
    /// Verifica se há usuários registrados com os mesmos dados
    const dataUserDb = await db.users.findUserCriteria({
      username: userForm.username,
      email: userForm.email,
    })

    /// Validação de dados existentes
    if (dataUserDb) {
      if (dataUserDb.email === userForm.email) {
        return NextResponse.json({ message: 'Email já cadastrado' }, { status: 409 })
      }
      if (dataUserDb.username === userForm.username) {
        return NextResponse.json({ message: 'Nome de usuário já cadastrado' }, { status: 409 })
      }
      return NextResponse.json({ message: 'Usuário já cadastrado' }, { status: 409 })
    }

    /// Gera senha provisória para o usuário
    const temporaryPassword = utils.generateRandomPass()

    /// Envia a senha provisória para o email do usuário
    emailServices.sendPasswordCreationEmail(userForm.email, userForm.name, temporaryPassword)

    /// Criptografa a senha
    const passCrypt = await PassCrypt.hashPassword(temporaryPassword)

    /// Cria o registro do usuário no banco
    const userId = await db.users.createUser({ ...userForm, pass: passCrypt, ativo: true })

    /// Cria os registros de acessos aos módulos, rotinas e recursos vindos no formulario
    await db.users.createFirstAccess(userId, {
      listModules: userForm.listModules,
      listRoutines: userForm.listRoutines,
      listResources: userForm.listResources,
    })

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

import { FormsCrypt, PassCrypt } from '@/services'
import { NextResponse } from 'next/server'
import { db } from '@/utils/database'

interface FormProps {
  name: string
  email: string
  username: string
  pass: string
}

export async function POST(request: Request) {
  const formData = await request.json()
  const userForm: FormProps = FormsCrypt.verifyData(formData)

  if (!userForm.name || !userForm.email || !userForm.username || !userForm.pass) {
    return NextResponse.json({ message: 'Verifique os campos e tente novamente' }, { status: 400 })
  }

  try {
    const dataUserDb = await db.users.findFirstUser({
      username: userForm.username,
      email: userForm.email,
    })

    if (dataUserDb) {
      if (dataUserDb.email === userForm.email) {
        return NextResponse.json({ message: 'Email já cadastrado' }, { status: 409 })
      }
      if (dataUserDb.username === userForm.username) {
        return NextResponse.json({ message: 'Nome de usuário já cadastrado' }, { status: 409 })
      }
      return NextResponse.json({ message: 'Usuário já cadastrado' }, { status: 409 })
    }

    const passCrypt = await PassCrypt.hashPassword(userForm.pass)

    db.users.createUser({ ...userForm, pass: passCrypt, ativo: true })

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

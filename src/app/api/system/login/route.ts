import { FormsCrypt, JwtService, PassCrypt } from '@/services'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { remapUsers } from '@/utils/remappers'
import { db } from '@/utils/database'

export async function POST(request: Request) {
  const formData = await request.json()
  const { username, pass }: { username: string; pass: string } = FormsCrypt.verifyData(formData)

  if (!username || !pass) {
    return NextResponse.json({ message: 'Verifique os campos e tente novamente' }, { status: 400 })
  }

  const userForm = remapUsers.srcUser({ username, pass })

  try {
    const userDb = await db.users.findFirstUser({
      username: userForm.usr_username,
    })

    if (!userDb) {
      return NextResponse.json({ message: 'Usuário inválido' }, { status: 401 })
    }

    const verifyPass = await PassCrypt.verifyPassword(userForm.usr_pass, userDb.pass)

    if (verifyPass !== true) {
      return NextResponse.json({ message: 'Senha inválida' }, { status: 401 })
    } else {
      const accessToken = JwtService.signIn({ usrId: userDb.usrId })

      if (accessToken === 'JWT_SECRET_NOT_FOUND') {
        return NextResponse.json({ message: 'Erro interno contate a TI' }, { status: 500 })
      }

      cookies().set('ssnAuth', accessToken, {
        httpOnly: true,
        // secure: true, DEIXAR TRUE SOMENTE QUANDO COLOCAR NO AR. O SECURE É PARA LIBERAR O COOKIE QUANDO O SITE TIVER SSL
        maxAge: 60 * 60 * 24,
        sameSite: 'strict',
        path: '/',
      })

      return NextResponse.json({ message: 'Usuário autorizado' }, { status: 200 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

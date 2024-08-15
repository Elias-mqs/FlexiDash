import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface AuthProps {
  valid: boolean
  user: {
    usrId: number
    iat: number
    exp: number
  }
  error: string
  message: string
  status: number
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('ssnAuth')?.value || ''

  try {
    const authRes = await fetch(new URL('/api/auth/me', request.url), {
      headers: { Authorization: token },
    })

    const authUser: AuthProps = await authRes.json()

    if (authUser.valid === false) {
      if (request.nextUrl.pathname === '/accounts/login') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/accounts/login', request.url))
    }

    if (
      request.nextUrl.pathname === '/accounts/login' ||
      request.nextUrl.pathname === '/accounts/recoveryPass'
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export const config = {
  matcher: ['/', '/module/:path*', '/accounts/:path*'],
}

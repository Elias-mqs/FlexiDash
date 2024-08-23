import { NextResponse } from 'next/server'

// import { FormsCrypt } from './services'

import { FormsCrypt } from './services'

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

interface ListModulesProps {
  sis_modulos: {
    nome: string
    slug: string
  }
}

interface ListRoutinesProps {
  sis_rotinas: {
    nome: string
    slug: string
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('ssnAuth')?.value || ''
  const cookieModule = request.cookies.get('acsModData')?.value
  const cookieRoutine = request.cookies.get('acsRtnData')?.value

  /// /////////////////////////////////////////////////////////////////////////
  /// /////// VERIFICAÇÃO DE AUTENTICAÇÃO DO USUÁRIO //////////////////////////
  /// /////////////////////////////////////////////////////////////////////////
  let authUser: AuthProps

  try {
    const authRes = await fetch(new URL('/api/auth/me', request.url), {
      headers: { Authorization: token },
    })
    authUser = await authRes.json()

    if (authUser.valid === false) {
      if (request.nextUrl.pathname === '/accounts/login') {
        return NextResponse.next()
      }

      return NextResponse.redirect(new URL('/accounts/login', request.url))
    }

    if (request.nextUrl.pathname === '/accounts/login' || request.nextUrl.pathname === '/accounts/recoveryPass') {
      return NextResponse.redirect(new URL('/modules', request.url))
    }
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return NextResponse.redirect(new URL('/accounts/login', request.url))
  }

  /// /////////////////////////////////////////////////////////////////////////
  /// /////// VERIFICAÇÃO DE PERMISSÃO DE ACESSO AOS MÓDULOS //////////////////
  /// /////////////////////////////////////////////////////////////////////////
  if (request.nextUrl.pathname.startsWith('/modules')) {
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean)

    if (pathSegments.length >= 2) {
      const moduleName = pathSegments[1]

      if (!cookieModule) return NextResponse.redirect(new URL('/modules', request.url))

      const descyptCookieMod: { data: { acsModId: number } } = FormsCrypt.verifyData({ data: cookieModule })

      if (!descyptCookieMod.data.acsModId) {
        return NextResponse.redirect(new URL('/modules', request.url))
      }

      try {
        const fetchModules = await fetch(new URL(`/api/middleware/listModules/${authUser.user.usrId}`, request.url), {
          method: 'GET',
          cache: 'force-cache',
          next: { revalidate: 3600 },
        })

        const listModules: ListModulesProps[] = await fetchModules.json()

        let isAuthorized = false

        for (const moduleData of listModules) {
          if (moduleData.sis_modulos.slug === moduleName) {
            isAuthorized = true
            break
          }
        }

        if (!isAuthorized) {
          return NextResponse.redirect(new URL('/modules', request.url))
        }
      } catch (error) {
        console.error('Erro listModules no middleware: ', error)
        return NextResponse.redirect(new URL('/modules', request.url))
      }

      /// /////////////////////////////////////////////////////////////////////////
      /// /////// VERIFICAÇÃO DE PERMISSÃO DE ACESSO ÀS ROTINAS ///////////////////
      /// /////////////////////////////////////////////////////////////////////////
      if (pathSegments.length >= 3) {
        const routineName = pathSegments[2]

        if (!cookieRoutine) {
          return NextResponse.redirect(new URL(`/modules/${moduleName}`, request.url))
        }

        const descyptCookieRtn: { acsRtnId: number } = FormsCrypt.verifyData({ data: cookieRoutine })

        if (!descyptCookieRtn.acsRtnId) {
          return NextResponse.redirect(new URL('/modules', request.url))
        }

        try {
          const fetchModules = await fetch(
            new URL(`/api/middleware/listRoutines/${descyptCookieMod.data.acsModId}`, request.url),
            {
              method: 'GET',
              cache: 'force-cache',
              next: { revalidate: 3600 },
            },
          )

          const listRoutines: ListRoutinesProps[] = await fetchModules.json()

          let isAuthorized = false

          for (const routineData of listRoutines) {
            if (routineData.sis_rotinas.slug === routineName) {
              isAuthorized = true
              break
            }
          }

          if (!isAuthorized) {
            return NextResponse.redirect(new URL(`/modules/${moduleName}`, request.url))
          }
        } catch (error) {
          console.error('Erro listRoutines no middleware: ', error)
          return NextResponse.redirect(new URL(`/modules/${moduleName}`, request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/modules/:path*', '/accounts/:path*'],
}

import { NextResponse } from 'next/server'

import { fetchAccess } from '@/utils/middleware/fetchData'
import { AuthProps, ListModulesProps, ListResourceProps, ListRoutinesProps } from '@/utils/middleware/types'

import { FormsCrypt } from './services'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('ssnAuth')?.value || ''
  const cookieModule = request.cookies.get('acsModData')?.value
  const cookieRoutine = request.cookies.get('acsRtnData')?.value

  const baseUrl = process.env.BASEURL
  const urlSelectMod = new URL('/modules', request.url)

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
      const urlModule = new URL(`/modules/${moduleName}`, request.url)

      if (!cookieModule) return NextResponse.redirect(urlSelectMod)

      const descyptCookieMod: { data: { acsModId: number } } = FormsCrypt.verifyData({ data: cookieModule })

      if (!descyptCookieMod.data.acsModId) {
        return NextResponse.redirect(urlSelectMod)
      }

      try {
        const listModules: ListModulesProps[] = await fetchAccess(
          `${baseUrl}/api/middleware/listModules/${authUser.user.usrId}`,
        )

        const isAuthorized = listModules.some((moduleData) => moduleData.sis_modulos.slug === moduleName)

        if (!isAuthorized) {
          return NextResponse.redirect(urlSelectMod)
        }
      } catch (error) {
        console.error('Erro listModules no middleware: ', error)
        return NextResponse.redirect(urlSelectMod)
      }

      /// /////////////////////////////////////////////////////////////////////////
      /// /////// VERIFICAÇÃO DE PERMISSÃO DE ACESSO ÀS ROTINAS ///////////////////
      /// /////////////////////////////////////////////////////////////////////////
      if (pathSegments.length >= 3) {
        const routineName = pathSegments[2]
        const urlRoutine = new URL(`/modules/${moduleName}/${routineName}`, request.url)

        if (!cookieRoutine) {
          return NextResponse.redirect(urlModule)
        }

        const descyptCookieRtn: { acsRtnId: number } = FormsCrypt.verifyData({ data: cookieRoutine })

        if (!descyptCookieRtn.acsRtnId) {
          return NextResponse.redirect(urlSelectMod)
        }

        try {
          const listRoutines: ListRoutinesProps[] = await fetchAccess(
            `${baseUrl}/api/middleware/listRoutines/${descyptCookieMod.data.acsModId}`,
          )

          const isAuthorized = listRoutines.some((routineData) => routineData.sis_rotinas.slug === routineName)

          if (!isAuthorized) {
            return NextResponse.redirect(urlModule)
          }

          /// /////////////////////////////////////////////////////////////////////////
          /// /////// VERIFICAÇÃO DE PERMISSÃO DE ACESSO AOS RECURSOS /////////////////
          /// /////////////////////////////////////////////////////////////////////////

          if (pathSegments.length >= 4) {
            const resourceName = pathSegments[3]

            try {
              const listResources: ListResourceProps[] = await fetchAccess(
                `${baseUrl}/api/middleware/listResources/${descyptCookieRtn.acsRtnId}`,
              )

              const isAuthorized = listResources.some(
                (resourceData) => resourceData.sis_recurso_rotina.slug === resourceName,
              )

              if (!isAuthorized) {
                return NextResponse.redirect(urlRoutine)
              }
            } catch (error) {
              console.error('Erro listResources no middleware: ', error)
              return NextResponse.redirect(urlRoutine)
            }
          }
        } catch (error) {
          console.error('Erro listRoutines no middleware: ', error)
          return NextResponse.redirect(urlModule)
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/modules/:path*', '/accounts/:path*'],
}

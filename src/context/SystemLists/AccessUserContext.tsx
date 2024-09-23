'use client'

import { createContext, ReactNode, useContext } from 'react'

import { useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

interface ListRoutineProps {
  id: number
  sis_rotinas: {
    id: number
    nome: string
    slug: string
  }
}

export type ListResourceProps = {
  id: number
  sis_recurso_rotina: {
    id: number
    nome: string
    slug: string
  }
}

interface ContextListProps {
  useListRoutine: () => ListRoutineProps[] | undefined
  useListResource: () => ListResourceProps[] | undefined
}

const AccessUserContext = createContext<ContextListProps | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AccessUserProvider({ children }: { children: ReactNode }) {
  const dataUser = useUserData()
  const toast = useToast()
  const router = useRouter()

  /// ////////////////////////////////////////////////////////////////////////////////////////////////
  /// //////////////////////// LISTA AS ROTINAS PERMITIDAS PARA O USUÁRIO ////////////////////////////
  /// ////////////////////////////////////////////////////////////////////////////////////////////////

  const useListRoutine = (): ListRoutineProps[] | undefined => {
    async function fetchListRoutine() {
      const dataAcsMod = Cookies.get('acsModData')

      if (!dataAcsMod) {
        router.push('/modules')
        return []
      }

      try {
        const { data } = await api.post('/modules/listRoutines', { data: dataAcsMod, usrId: dataUser.id })

        const dataList: ListRoutineProps[] = FormsCrypt.verifyData(data)

        return dataList
      } catch (error: unknown) {
        toast({
          title: 'Erro interno',
          description: 'Contate a TI',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        return []
      }
    }

    const { data: routineList } = useQuery({
      queryKey: ['acsModData'],
      queryFn: fetchListRoutine,
      enabled: true,
      refetchOnWindowFocus: false,
    })

    if (!routineList) return []

    return routineList
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////
  /// //////////////////////// LISTA OS RECURSOS PERMITIDOS PARA O USUÁRIO ////////////////////////////
  /// ////////////////////////////////////////////////////////////////////////////////////////////////

  const useListResource = (): ListResourceProps[] | undefined => {
    async function fetchListResource() {
      const dataAcsRtn = Cookies.get('acsRtnData')

      if (!dataAcsRtn) {
        router.push('/modules')
        return []
      }

      try {
        const { data } = await api.post('/modules/listResources', { data: dataAcsRtn, usrId: dataUser.id })

        const dataList = FormsCrypt.verifyData(data)

        return dataList as ListResourceProps[]
      } catch (error: unknown) {
        toast({
          title: 'Erro interno',
          description: 'Contate a TI',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        return []
      }
    }

    const { data: resourceList } = useQuery({
      queryKey: ['acsRscData'],
      queryFn: fetchListResource,
      enabled: true,
      refetchOnWindowFocus: false,
    })

    if (!resourceList) return []

    return resourceList
  }

  return <AccessUserContext.Provider value={{ useListRoutine, useListResource }}>{children}</AccessUserContext.Provider>
}

export const useAccessUser = () => {
  const context = useContext(AccessUserContext)
  if (context === undefined) {
    throw new Error('useAccessUser deve ser usado dentro de um AccessUserProvider')
  }
  return context
}

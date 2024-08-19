'use client'

import { createContext, useContext } from 'react'

import { useQuery } from '@tanstack/react-query'

import { api, FormsCrypt } from '@/services'

interface DataUserProps {
  id: number
  nome: string
  usuario: string
  email: string
  ativo: boolean
}

const UserDataContext = createContext<DataUserProps | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserDataPrivider({ children }: any) {
  const { data } = useQuery({
    queryKey: ['dataUser'],
    queryFn: async (): Promise<DataUserProps | null | undefined> => {
      try {
        const res = await api.get('/system/user/userDataRoute')
        const dataUser = FormsCrypt.verifyData(res.data)
        if (!dataUser) {
          return null
        } else {
          return dataUser as DataUserProps
        }
      } catch (error) {
        console.log(error)
      }
    },
    enabled: true,
    refetchOnWindowFocus: false,
  })

  if (!data) return

  return <UserDataContext.Provider value={data}>{children}</UserDataContext.Provider>
}

export const useUserData = () => useContext(UserDataContext)

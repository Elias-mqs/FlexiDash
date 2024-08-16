'use client'

import { createContext, useContext } from 'react'

import { useQuery } from '@tanstack/react-query'

import { api, FormsCrypt } from '@/services'

const UserDataContext = createContext({})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserDataPrivider({ children }: any) {
  const { data } = useQuery({
    queryKey: ['dataUser'],
    queryFn: async () => {
      const res = await api.get('/system/user/userData')
      const dataUser = FormsCrypt.verifyData(res)
      return dataUser
    },
    enabled: true,
    refetchOnWindowFocus: false,
  })

  console.log(data)

  return <UserDataContext.Provider value={{}}>{children}</UserDataContext.Provider>
}

export const useUserData = () => useContext(UserDataContext)

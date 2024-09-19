'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface InventoryContextProps {
  progressValue: number
  setProgress: (data: number) => void
}

const InventoryContext = createContext<InventoryContextProps>({} as InventoryContextProps)

export default function InventoryProvider({ children }: { children: ReactNode }) {
  const [progressValue, setProgressValue] = useState<number>(0)

  const setProgress = (data: number) => {
    setProgressValue(data)
  }

  return <InventoryContext.Provider value={{ progressValue, setProgress }}>{children}</InventoryContext.Provider>
}

export const useInventoryContext = () => useContext(InventoryContext)

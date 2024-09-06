'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface LayoutProps {
  toggleSideBar: () => void
  isExpanded: boolean
}

const LayoutComponentContext = createContext<LayoutProps>({} as LayoutProps)

export default function LayoutCompProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const toggleSideBar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <LayoutComponentContext.Provider value={{ toggleSideBar, isExpanded }}>{children}</LayoutComponentContext.Provider>
  )
}

export const useLayoutComponent = () => {
  const context = useContext(LayoutComponentContext)
  if (!context) {
    throw new Error('useLayoutComponent must be used within a LayoutCompProvider')
  }
  return context
}

import { MainContainer } from '@/components/ui/Containers/MainContainer'
import LayoutCompProvider from '@/context/LayoutComponents/LayoutCompContext'
import { AccessUserProvider } from '@/context/SystemLists/AccessUserContext'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Módulo - H2L',
  description: 'Aplicação para recursos do setor de estoque da H2L',
}

export default function ModuleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AccessUserProvider>
      <LayoutCompProvider>
        <MainContainer>{children}</MainContainer>
      </LayoutCompProvider>
    </AccessUserProvider>
  )
}

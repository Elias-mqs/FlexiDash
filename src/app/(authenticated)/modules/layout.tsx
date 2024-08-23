import { Suspense } from 'react'

import { Container } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Roboto } from 'next/font/google'

import UserDataPrivider from '@/context/User/UserDataContext'
import { ProvidersChakra } from '@/providers/chakra'
import { queryClient } from '@/services/queryClient'

import Loading from './loading'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seleção de Módulo - H2L',
  description: 'Página para selecionar o módulo desejado.',
}

const robotoFont = Roboto({ weight: ['100', '400', '500', '700'], subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProvidersChakra>
      <QueryClientProvider client={queryClient}>
        <UserDataPrivider>
          <Container maxW="container.2xl" px={4} className={robotoFont.className}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </Container>
        </UserDataPrivider>
      </QueryClientProvider>
    </ProvidersChakra>
  )
}

import { Container } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Roboto } from 'next/font/google'

import UserDataPrivider from '@/context/User/UserDataContext'
import { ProvidersChakra } from '@/providers/chakra'
import { queryClient } from '@/services/queryClient'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Módulos - H2L',
  description: 'Página para selecionar o módulo desejado.',
}

const robotoFont = Roboto({ weight: ['100', '400', '500', '700'], subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ background: '#d0d0d0' }} className={robotoFont.className}>
        <ProvidersChakra>
          <QueryClientProvider client={queryClient}>
            <UserDataPrivider>
              <Container maxW="container.xl" px={4}>
                {children}
              </Container>
            </UserDataPrivider>
          </QueryClientProvider>
        </ProvidersChakra>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { ProvidersChakra } from '@/providers/chakra'
import { Container } from '@chakra-ui/react'
import { Roboto } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Módulos - H2L',
  description: 'Página para selecionar o módulo desejado.',
}

const robotoFont = Roboto({
  weight: ['100', '400', '500', '700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body style={{ background: '#EDF2F7' }} className={robotoFont.className}>
        <ProvidersChakra>
          <Container bg="gray.100" maxW="container.xl" px={4}>
            {children}
          </Container>
        </ProvidersChakra>
      </body>
    </html>
  )
}

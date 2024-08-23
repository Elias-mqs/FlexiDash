import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Módulos - H2L',
  description: 'Página para selecionar o módulo desejado.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ background: '#EDF2F7' }}>{children}</body>
    </html>
  )
}

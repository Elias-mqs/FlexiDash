import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Módulos - H2L',
  description: 'Página para selecionar o módulo desejado.',
  robots: { index: false, follow: false },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ background: '#EDF2F7' }}>{children}</body>
    </html>
  )
}

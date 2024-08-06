
export const metadata = {
    title: 'Recuperação de senha - H2L',
    description: 'Página para recuperar a senha caso necessário.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}

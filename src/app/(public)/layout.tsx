import { ChakraProvider } from "@chakra-ui/react"

export const metadata = {
    title: '',
    description: '',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br">
            <body>
                <ChakraProvider>
                    {children}
                </ChakraProvider>
            </body>
        </html>
    )
}

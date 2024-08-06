import { ProvidersChakra } from "@/providers/chakra";

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
                <ProvidersChakra>
                    {children}
                </ProvidersChakra>
            </body>
        </html>
    )
}

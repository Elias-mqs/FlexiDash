import { ProvidersChakra } from "@/providers/chakra";
import { Roboto } from "next/font/google";

export const metadata = {
    title: '',
    description: '',
}

const robotoFont = Roboto({
    weight: ['100', '400', '500', '700'],
    subsets: ['latin'],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br">
            <body className={robotoFont.className}>
                <ProvidersChakra>
                    {children}
                </ProvidersChakra>
            </body>
        </html>
    )
}

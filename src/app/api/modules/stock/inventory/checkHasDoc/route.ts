import dayjs from 'dayjs'
import { NextResponse, type NextRequest } from 'next/server'

interface NoRegistrationProps {
  errorCode: number
  errorMessage: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reqUrl = process.env.ENDPOINT_VERIFY_INVDOC
  const document = searchParams.get('slug')

  if (!document) {
    throw new Error('document não fornecido')
  }

  const formattedDate = dayjs().format('YYYYMMDD')

  // Status de requisição previstos e tratados
  const allowedStatus = [200, 400, 404]

  try {
    const res = await fetch(`${reqUrl}cVerif=${document}&cData=${formattedDate}`, { method: 'GET' })

    if (!allowedStatus.includes(res.status)) {
      throw new Error('Erro não previsto na api do TOTVS')
    }

    const response: { document: string } | NoRegistrationProps = await res.json()

    if ('errorCode' in response) {
      if (response.errorMessage === 'Registro não encontrado') {
        return NextResponse.json({ hasDoc: false }, { status: 200 })
      }
      throw new Error('Erro no fetch res')
    }

    if (response.document) {
      return NextResponse.json({ hasDoc: true }, { status: 200 })
    }
  } catch (error) {
    console.error('Erro interno no checkHasDoc', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

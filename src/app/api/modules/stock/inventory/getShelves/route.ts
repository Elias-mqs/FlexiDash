import { NextResponse } from 'next/server'

interface ListShelvesProps {
  listPrat: {
    codPrat: string
  }[]
}

export async function GET() {
  const urlFetch = process.env.ENDPOINT_GET_SHELVES
  try {
    const res = await fetch(`${urlFetch}`, { method: 'GET', cache: 'force-cache' })

    const { listPrat: listShelves }: ListShelvesProps = await res.json()

    return NextResponse.json({ listShelves }, { status: 200 })
  } catch (error) {
    console.error('Erro no getShelves', error)
    return NextResponse.json({ message: 'Erro interno - contate a TI' }, { status: 500 })
  }
}

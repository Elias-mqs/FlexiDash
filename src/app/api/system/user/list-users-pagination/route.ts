import { NextResponse, type NextRequest } from 'next/server'

import { db } from '@/utils/database'

interface ListUsersProps {
  id: number
  nome: string
  usuario: string
  email: string
  ativo: boolean
}

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get('page')
  const perPageParam = request.nextUrl.searchParams.get('per_page')

  const page = pageParam ? Number(pageParam) : 1
  const perPage = perPageParam ? Number(perPageParam) : 10

  try {
    const listUsers: ListUsersProps[] = await db.users.findAllUsers()

    // Total de itens (usuários)
    const totalItems = listUsers.length

    // Número total de páginas
    const totalPages = Math.ceil(totalItems / perPage)

    // Página anterior (se não houver, será null)
    const prevPage = page > 1 ? page - 1 : null

    // Próxima página (se não houver, será null)
    const nextPage = page < totalPages ? page + 1 : null

    // Índices para o slice do array
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage

    // Pegar a página atual de usuários
    const currentPageUsers = listUsers.slice(startIndex, endIndex)

    // Objeto de resposta com dados de paginação
    const paginationResponse = {
      first: 1, // Primeira página
      prev: prevPage, // Página anterior ou null
      next: nextPage, // Próxima página ou null
      last: totalPages, // Última página
      pages: totalPages, // Número total de páginas
      items: totalItems, // Número total de usuários
      data: currentPageUsers, // Dados paginados
    }

    return NextResponse.json(paginationResponse, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar lista de usuários paginada:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

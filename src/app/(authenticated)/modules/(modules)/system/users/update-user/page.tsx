'use client'

import { useState } from 'react'

import { Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Select } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { api } from '@/services'

interface ListUsersProps {
  id: number
  nome: string
  usuario: string
  email: string
  ativo: boolean
}

interface listUsersPaginationProps {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: ListUsersProps[]
}

export default function UpdateUser() {
  console.log('================= renderizando ==================')
  const searchParams = useSearchParams()

  const [perPage, setPerPage] = useState<number>(10)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: listUsersPagination } = useQuery<listUsersPaginationProps>({
    queryKey: ['users', 'updateUserPage', 'getAll', page],
    queryFn: async () => {
      searchParams.get('per_page') ?? setPerPage(Number(searchParams.get('per_page')))
      const response = await api.get(`system/user/list-users-pagination?page=${page}&per_page=${perPage}`)
      return response.data
    },
  })

  console.log(listUsersPagination)

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex w-auto justify-center gap-2">
          <label className="my-auto text-sm font-medium text-gray-600">Linhas por página:</label>

          <Select w="72px" className="h-9 text-base">
            <option value="10">10</option>
            <option value="15" selected>
              15
            </option>
            <option value="20">20</option>
            <option value="30">30</option>
          </Select>
        </div>

        <div className="flex gap-4">
          <input placeholder="colocar um input aqui com um icon search" className="w-96 bg-red-400" />
          <button>Search</button>
        </div>
      </div>

      <TableContainer>
        <Table variant="simple" colorScheme="blue">
          <Thead>
            <Tr>
              <Th fontWeight={600} fontSize={14} color="#829abf">
                Nome
              </Th>
              <Th fontWeight={600} fontSize={14} color="#829abf">
                Usuário
              </Th>
              <Th fontWeight={600} fontSize={14} color="#829abf">
                Email
              </Th>
              <Th fontWeight={600} fontSize={14} color="#829abf">
                Ativo
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {listUsersPagination?.data.map((dataUser) => (
              <Tr key={dataUser.id}>
                <Td py={4} fontWeight={500}>
                  {dataUser.nome}
                </Td>
                <Td py={4} fontWeight={500}>
                  {dataUser.usuario}
                </Td>
                <Td py={4} fontWeight={500}>
                  {dataUser.email}
                </Td>
                <Td py={4} fontWeight={500}>
                  {dataUser.ativo ? 'Ativo' : 'Inativo'}
                </Td>
              </Tr>
            ))}
          </Tbody>

          {/* O conteudo do Tfoot vai ser substituido pelo pagination */}
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </main>
  )
}

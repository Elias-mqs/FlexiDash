'use client'

import { useState } from 'react'

import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Flex,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'

import { Pagination } from '@/components/ui/Pagination'
import { UpdateUserModal } from '@/components/ui/System/User/UpdateUserModal'
import { api } from '@/services'

export interface ListUsersProps {
  id: number
  nome: string
  usuario: string
  email: string
  ativo: boolean
}

export interface ListUsersPaginationProps {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: ListUsersProps[]
}

export default function UpdateUser() {
  const searchParams = useSearchParams()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [searchUser, setSearchUser] = useState('')
  const [activeModal, setActiveModal] = useState<ListUsersProps | null>(null)

  /// Busca na url a página aberta e quantidade de itens por página para montar a paginação
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const perPage = searchParams.get('per_page') ? searchParams.get('per_page') : '10'

  /// Busca lista de todos os usuários cadastrados no sistema
  const { data: listUsersPagination, refetch: refetchListUsers } = useQuery<ListUsersPaginationProps>({
    queryKey: ['users', 'updateUserPage', 'getAll', page, perPage],
    queryFn: async () => {
      const response = await api.get(`system/user/list-users-pagination?page=${page}&per_page=${perPage}`)
      return response.data
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  /// isLoading
  if (!listUsersPagination || listUsersPagination.data.length < 1) {
    return (
      <Flex as="main" flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  /// Filtro do input "Buscar"
  const filteredList =
    searchUser.length > 0
      ? listUsersPagination.data.filter((user) =>
          [user.nome, user.usuario, user.email].some((field) => field.toLowerCase().includes(searchUser.toLowerCase())),
        )
      : listUsersPagination.data

  /// Controle de abertura do modal de informações do usuário
  const handleOpen = (modalUser: ListUsersProps) => {
    setActiveModal(modalUser)
    onOpen()
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 overflow-y-auto p-4">
      <div className="flex justify-end gap-4">
        <InputGroup size="md" w={{ base: '100%', sm: '250px' }} borderRadius="50%">
          <Input placeholder="Buscar" borderRadius="1rem" onChange={(e) => setSearchUser(e.target.value)} />

          <InputRightElement>
            <IconButton aria-label="Search user" colorScheme="transparent" icon={<FaSearch color="c0c0c0" />} />
          </InputRightElement>
        </InputGroup>
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
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredList.map((dataUser) => (
              <Tr key={dataUser.id} className="hover:bg-zinc-100">
                <Td py={4} fontWeight={500}>
                  {dataUser.nome}
                </Td>
                <Td py={4} fontWeight={500}>
                  {dataUser.usuario}
                </Td>
                <Td py={4} fontWeight={500}>
                  {dataUser.email}
                </Td>
                <Td w="130px" fontWeight={400}>
                  <Text
                    py={0.5}
                    px={2}
                    align="center"
                    color="#fff"
                    borderRadius={12}
                    bg={dataUser.ativo ? 'green' : 'red'}
                  >
                    {dataUser.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                </Td>
                <Td>
                  <Text
                    as="button"
                    fontWeight={600}
                    color="#2458ab"
                    fontSize={14}
                    _hover={{ transform: 'scale(1.1)' }}
                    cursor="pointer"
                    transition="all .1s ease"
                    onClick={() => handleOpen(dataUser)}
                  >
                    Alterar
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {listUsersPagination && (
        <Pagination
          page={page}
          pages={listUsersPagination.pages}
          items={listUsersPagination.items}
          perPage={perPage!}
          viewing={listUsersPagination.data.length}
        />
      )}

      <UpdateUserModal
        isOpen={isOpen}
        onClose={onClose}
        activeModal={activeModal}
        refetchListUsers={refetchListUsers}
      />
    </main>
  )
}

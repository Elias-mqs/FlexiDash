import { Suspense, useState } from 'react'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Checkbox,
  useDisclosure,
  Stack,
  ModalHeader,
  Input,
  Flex,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { FaCheckCircle } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'

import { api, FormsCrypt } from '@/services'
import { TeamMember } from '@/utils/database/modules/estoque/inventario/team'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TeamMembers({ setValue }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [filterMembers, setFilterMembers] = useState('')

  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

  // Busca lista de usuários permitidos à participar do inventário
  const { data: listUsers } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data } = await api.get('modules/stock/inventory/getTeamMember')
      const listUsers: TeamMember[] = FormsCrypt.verifyData(data)

      return listUsers
    },
    refetchOnWindowFocus: false,
  })

  // Filtro para usuários
  const filteredMembers = filterMembers.length > 0 ? listUsers?.filter((user) => user.nome.includes(filterMembers)) : []

  // Seta o id do usuário no formulário pai
  const handleCheckboxChange = (memberId: number) => {
    let updatedSelectedMembers: number[]

    if (selectedMembers.includes(memberId)) {
      updatedSelectedMembers = selectedMembers.filter((id) => id !== memberId)
    } else {
      updatedSelectedMembers = [...selectedMembers, memberId]
    }

    setSelectedMembers(updatedSelectedMembers)
    setValue('teamMemberId', updatedSelectedMembers)
  }

  return (
    <Suspense>
      <Button
        bg="transparent"
        border="1px solid #e0e0e0"
        rightIcon={selectedMembers.length > 0 ? <FaCheckCircle color="green" /> : <FiSearch />}
        color="gray.500"
        fontWeight={500}
        onClick={onOpen}
      >
        {selectedMembers.length > 0 ? 'Equipe formada' : 'Selecionar'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader borderBottom="1px solid #f0f0f0" mx={2}>
            Membros da equipe
          </ModalHeader>

          <ModalCloseButton />

          <Stack p={4} gap={4}>
            <Input placeholder="Buscar membro" onChange={(e) => setFilterMembers(e.target.value)} />

            <Flex direction="column" px={4}>
              {(filterMembers.length > 0 ? filteredMembers : listUsers)?.map((member) => (
                <Checkbox
                  key={member.id}
                  isChecked={selectedMembers.includes(member.id)}
                  onChange={() => handleCheckboxChange(member.id)}
                  fontWeight={500}
                  color="gray.500"
                >
                  {member.nome}
                </Checkbox>
              ))}
            </Flex>

            <Button colorScheme="blue" bg="blue.400" onClick={onClose}>
              Montar equipe
            </Button>
          </Stack>
        </ModalContent>
      </Modal>
    </Suspense>
  )
}

import { Suspense, useState, useEffect } from 'react'

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
  Spinner,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { FaCheckCircle } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'

import { api, FormsCrypt } from '@/services'
import { TeamMember } from '@/utils/database/modules/estoque/inventario/team'

interface MembersProps {
  allowedMembers: TeamMember[]
  participants: TeamMember[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditTeamMembers({ setValue, document }: {setValue:any, document: string}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [filterMembers, setFilterMembers] = useState('')

  // Estado para manter os membros selecionados
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

  // Busca lista de usuários permitidos e inscritos
  const { data: listUsers } = useQuery({
    queryKey: ['edit-team'],
    queryFn: async () => {
      const formData = FormsCrypt.dataCrypt({ document })
      try {
        const { data } = await api.post('modules/stock/inventory/editTeamMembers', formData)
        const listUsers: MembersProps = FormsCrypt.verifyData(data)

        return listUsers
      } catch (error) {
        console.error('INTERNAL ERROR')
      }
    },
    gcTime: 0,
    staleTime: 0,
  })

  // UseEffect para definir o estado inicial de selectedMembers com os usuários já inscritos
  useEffect(() => {
    if (listUsers?.participants) {
      const initialSelectedMembers = listUsers.participants.map((member) => member.id)
      setSelectedMembers(initialSelectedMembers)
      setValue('teamMemberId', initialSelectedMembers) // Seta o estado inicial no formulário pai
    }
  }, [listUsers, setValue])

  // Filtro para usuários
  const filteredMembers =
    filterMembers.length > 0
      ? listUsers?.allowedMembers.filter((user) => user.nome.includes(filterMembers))
      : listUsers?.allowedMembers

  // Seta o id do usuário no formulário pai
  const handleCheckboxChange = (memberId: number) => {
    let updatedSelectedMembers: number[]

    if (selectedMembers.includes(memberId)) {
      updatedSelectedMembers = selectedMembers.filter((id) => id !== memberId)
    } else {
      updatedSelectedMembers = [...selectedMembers, memberId]
    }

    setSelectedMembers(updatedSelectedMembers)
    setValue('teamMemberId', updatedSelectedMembers) // Atualiza o valor no formulário pai
  }

  return (
    <Suspense>
      <Button
        bg="transparent"
        boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
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

            {listUsers?.allowedMembers ? (
              <Flex direction="column" px={4}>
                {(filterMembers.length > 0 ? filteredMembers : listUsers?.allowedMembers)?.map((member) => (
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
            ) : (
              <Flex w="100%" justify="center">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" />
              </Flex>
            )}

            <Button colorScheme="blue" bg="blue.400" onClick={onClose}>
              Montar equipe
            </Button>
          </Stack>
        </ModalContent>
      </Modal>
    </Suspense>
  )
}

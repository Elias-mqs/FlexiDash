import {
  Button,
  Flex,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FaCheck } from 'react-icons/fa'
import { RiCloseLine } from 'react-icons/ri'
import { z } from 'zod'

import { EditTeamMembers } from './EditTeam'
import { Armazens } from './getArmaz'

const updateInvSchema = z.object({
  document: z.coerce.string().max(9),
  armaz: z.coerce.string().max(2),
  teamMemberId: z.array(z.coerce.number()),
})

type UpdateInvProps = z.infer<typeof updateInvSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditDocument({ isOpen, onClose }: any) {
  const { control, handleSubmit, setValue } = useForm<UpdateInvProps>({
    resolver: zodResolver(updateInvSchema),
    defaultValues: { document: '', armaz: '', teamMemberId: [] },
  })

  const handleUpdateInv = async (data: UpdateInvProps) => {
    console.log(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx={4} borderBottomRadius="10px">
        <ModalHeader borderBottom="1px solid #f0f0f0" mx={2}>
          Atualizar inventário
        </ModalHeader>

        <ModalCloseButton />
        <Flex
          direction="column"
          bg="#e0e0e0"
          borderBottomRadius="10px"
          as="form"
          onSubmit={handleSubmit(handleUpdateInv)}
        >
          <Flex
            direction="column"
            p={4}
            pb={6}
            borderBottomRadius="15px"
            bg="#fff"
            gap={2}
            boxShadow="0px 1px 1px 1px rgba(0, 0, 0, 0.1)"
          >
            <Controller
              name="document"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Flex direction="column" w="100%">
                  <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                    N° Inventário:
                  </Text>

                  <Input
                    value={value}
                    onChange={onChange}
                    maxLength={9}
                    fontWeight={500}
                    color="gray.500"
                    placeholder="10238912"
                  />
                </Flex>
              )}
            />

            <Controller
              name="armaz"
              control={control}
              render={({ field }) => (
                <Flex w="100%" direction="column">
                  <Text fontWeight={600} fontSize={14} pb={1} pl={2} color="#1E3A8A">
                    Armazém:
                  </Text>

                  <Armazens field={field} />
                </Flex>
              )}
            />

            <Flex direction="column" w="100%">
              <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                Membros da equipe:
              </Text>

              <EditTeamMembers setValue={setValue} />
            </Flex>
          </Flex>

          <Flex w="100%" justify="end" gap={4} p={4}>
            <Button
              type="submit"
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="green.500"
              size="sm"
              colorScheme="green"
              gap={2}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <FaCheck />
              Atualizar
            </Button>

            <Button
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="red.500"
              size="sm"
              colorScheme="red"
              gap={1}
              onClick={onClose}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <RiCloseLine fontSize={22} />
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

'use client'

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
  useToast,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { FaCheck, FaRegEdit } from 'react-icons/fa'
import { RiCloseLine } from 'react-icons/ri'
import { z } from 'zod'

import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

import { EditTeamMembers } from './EditTeam'
import { Armazens } from './getArmaz'

interface EditDocumentProps {
  isOpen: boolean
  onClose: () => void
  document: string
  armaz: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any
}

const updateInvSchema = z.object({
  document: z.coerce.string().max(9),
  armaz: z.coerce.string().max(2),
  teamMemberId: z.array(z.coerce.number()),
})

export type UpdateInvProps = z.infer<typeof updateInvSchema>

export function EditDocument({ isOpen, onClose, document, armaz, refetch }: EditDocumentProps) {
  const dataUser = useUserData()

  const toast = useToast()

  /// ///////////// Formulário para atualizar informações do inventário
  const { control, handleSubmit, setValue } = useForm<UpdateInvProps>({
    resolver: zodResolver(updateInvSchema),
    defaultValues: { document, armaz, teamMemberId: [] },
  })

  /// ///////////// Verifica se há registro no inventário criado
  const checkHasInvDoc = async () => {
    try {
      const res = await api.get(`modules/stock/inventory/checkHasDoc?slug=${document}`)

      const hasDoc: { hasDoc: boolean } = res.data

      return hasDoc
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro interno - contate a TI',
        description: '',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  /// ///////////// Chama sem cachear a função
  const { data } = useQuery({
    queryKey: ['has-invDoc'],
    queryFn: checkHasInvDoc,
    staleTime: 0,
    gcTime: 0,
  })

  /// ///////////// Variável para controlar qual componente deve ser renderizado
  let lockInput: boolean = false

  if (!data) {
    return
  }

  if (data.hasDoc === true) {
    lockInput = true
  }

  /// ///////////// Envia o formulário para atualização do inventário
  const handleUpdateInv = async (data: UpdateInvProps) => {
    if (!data.armaz || !data.document || !data.teamMemberId) {
      return toast({
        title: 'Erro com as informações',
        description: 'Tente novamente ou contate  a Ti',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    }

    if (data.teamMemberId.length < 1) {
      data.teamMemberId.push(dataUser.id)
    }

    const formCrypt = FormsCrypt.dataCrypt(data)

    try {
      const res = await api.post('modules/stock/inventory/updateInventory', formCrypt)

      toast({
        title: res.data.message,
        description: '',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })

      refetch()
      onClose()
    } catch (error) {
      return toast({
        title: 'Erro ao atualizar - contate a TI',
        description: '',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx={4} borderBottomRadius="10px">
        <ModalHeader borderBottom="1px solid #e5e5e5" mx={2} px={4}>
          <Flex direction="column" gap={2}>
            <Flex
              w="40px"
              h="40px"
              pl={1}
              align="center"
              justify="center"
              border="1px solid #e0e0e0"
              borderRadius={10}
              boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
            >
              <FaRegEdit size="22px" color="gray" />
            </Flex>
            <Text>Atualizar inventário</Text>
          </Flex>
        </ModalHeader>

        <ModalCloseButton />
        <Flex direction="column" as="form" onSubmit={handleSubmit(handleUpdateInv)}>
          <Flex direction="column" p={4} pb={6} borderBottom="1px solid #e5e5e5" bg="#fff" gap={2}>
            {lockInput ? (
              <Flex direction="column" w="100%">
                <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                  N° Inventário:
                </Text>

                <Flex w="100%" h="40px" px={4} align="center" border="1px solid #e0e0e0" borderRadius=".375rem">
                  <Text color="gray.500" fontWeight={500} cursor="default">
                    {document}
                  </Text>
                </Flex>
              </Flex>
            ) : (
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
                      boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
                    />
                  </Flex>
                )}
              />
            )}

            {lockInput ? (
              <Flex direction="column" w="100%">
                <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                  Armazém:
                </Text>

                <Flex w="100%" h="40px" px={4} align="center" border="1px solid #e0e0e0" borderRadius=".375rem">
                  <Text color="gray.500" fontWeight={500} cursor="default">
                    {armaz}
                  </Text>
                </Flex>
              </Flex>
            ) : (
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
            )}

            <Flex direction="column" w="100%">
              <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                Membros da equipe:
              </Text>

              <EditTeamMembers setValue={setValue} document={document} armaz={armaz} />
            </Flex>
          </Flex>

          <Flex w="100%" gap={4} p={4}>
            <Button
              w="100%"
              boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.1)"
              bg="transparent"
              size="sm"
              border="1px solid #e0e0e0"
              gap={1}
              onClick={onClose}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <RiCloseLine fontSize={22} />
              Cancelar
            </Button>

            <Button
              w="100%"
              type="submit"
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="blue.500"
              size="sm"
              colorScheme="blue"
              gap={2}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <FaCheck />
              Atualizar
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

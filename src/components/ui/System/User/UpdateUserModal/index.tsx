'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Spinner,
  Text,
  ModalHeader,
} from '@chakra-ui/react'
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { TbEdit } from 'react-icons/tb'

import {
  ListUsersPaginationProps,
  ListUsersProps,
} from '@/app/(authenticated)/modules/(modules)/system/users/update-user/page'
import { UserAccessProps } from '@/app/api/system/user/update-user/get-list-access/types'
import { api, FormsCrypt } from '@/services'

import { UserUpdateForm } from './UserUpdateForm'

interface UpdateUserModalProps {
  isOpen: boolean
  onClose: () => void
  activeModal: ListUsersProps | null
  refetchListUsers: (options?: RefetchOptions) => Promise<QueryObserverResult<ListUsersPaginationProps, Error>>
}

export function UpdateUserModal({ isOpen, onClose, activeModal, refetchListUsers }: UpdateUserModalProps) {
  /// //////////// Busca lista dos ids dos acessos dos usuários
  const { data: userAccessList, refetch: refetchUserAccessesList } = useQuery({
    queryKey: ['user', 'get-access', 'update-modal', activeModal],
    queryFn: async () => {
      if (!activeModal) throw new Error('No active modal')

      const dataCrypt = FormsCrypt.dataCrypt({ userId: activeModal.id })
      const res = await api.post('system/user/update-user/get-list-access', dataCrypt)

      return res.data as UserAccessProps
    },
    refetchOnWindowFocus: false,
    enabled: isOpen,
  })

  /// //////////// Is loading
  if (!userAccessList || !activeModal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent mx={4} py={8}>
          <ModalCloseButton />
          <ModalBody>
            <Flex as="main" pb={8} flex="1" direction="column" align="center" justify="center" gap={2}>
              <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
              <Text fontWeight="bold">Carregando...</Text>
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////
  /// //////////////////// Envia o formulario para atualização do usuário ////////////////////
  /// ////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader borderBottom="1px solid #f0f0f0" mt={2} mx={4} pb={2}>
          <Flex mb={2} align="center">
            <Flex p={2} bg="#E2E8F0" borderRadius="full" w="40px">
              <TbEdit color="#718096" fontSize={24} />
            </Flex>
            <Text ml={4} fontSize={22} fontWeight={700}>
              Atualizar informações
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody minH="xl" maxH="37rem" overflowY="auto">
          <UserUpdateForm
            dataUser={activeModal}
            userAccessList={userAccessList}
            onClose={onClose}
            refetchUserAccessesList={refetchUserAccessesList}
            refetchListUsers={refetchListUsers}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

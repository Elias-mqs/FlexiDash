import { Button, Flex, FormControl, Input, Select, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

import {
  ListUsersPaginationProps,
  ListUsersProps,
} from '@/app/(authenticated)/modules/(modules)/system/users/update-user/page'
import { UserAccessProps } from '@/app/api/system/user/update-user/get-list-access/types'
import { api, FormsCrypt } from '@/services'

import { UpdateConfirmationModal } from '../UpdateConfirmationModal'

import { AccessUpdateForm } from './AccessUpdateForm'
import { userAccessPropsSchema } from './schemaUserAccess'

const schemaUserData = z.object({
  name: z.string().min(3).trim(),
  email: z.string().email(),
  username: z.string().min(3),
  active: z.enum(['active', 'inactive']),
  userAccesses: z.array(userAccessPropsSchema),
})

export type UserDataFormProps = z.infer<typeof schemaUserData>

type UserUpdateForm = {
  dataUser: ListUsersProps
  userAccessList: UserAccessProps
  onClose: () => void
  refetchUserAccessesList: (options?: RefetchOptions) => Promise<QueryObserverResult<UserAccessProps, Error>>
  refetchListUsers: (options?: RefetchOptions) => Promise<QueryObserverResult<ListUsersPaginationProps, Error>>
}

export function UserUpdateForm({
  dataUser,
  userAccessList,
  onClose,
  refetchUserAccessesList,
  refetchListUsers,
}: UserUpdateForm) {
  const toast = useToast()
  const modalConfirmation = useDisclosure()

  /// Somente features que o usuário está cadastrado, sem informações de tabelas de acesso
  const userAccesses = userAccessList.sis_acess_modulo.map((modulo) => ({
    id: modulo.sis_modulos.id,
    nome: modulo.sis_modulos.nome,
    sis_rotinas: modulo.sis_acess_rotina.map((rotina) => ({
      id: rotina.sis_rotinas.id,
      nome: rotina.sis_rotinas.nome,
      mod_id: rotina.sis_rotinas.mod_id,
      sis_recurso_rotina: rotina.sis_acess_recurso.map((recurso) => ({
        id: recurso.sis_recurso_rotina.id,
        nome: recurso.sis_recurso_rotina.nome,
        rotina_id: recurso.sis_recurso_rotina.rotina_id,
      })),
    })),
  }))

  const { control, handleSubmit, watch, setValue } = useForm<UserDataFormProps>({
    resolver: zodResolver(schemaUserData),
    defaultValues: {
      name: dataUser.nome,
      email: dataUser.email,
      username: dataUser.usuario,
      active: dataUser.ativo ? 'active' : 'inactive',
      userAccesses,
    },
  })

  /// Envia o formulário para atualização dos dados do usuário
  const handleUpdateUserForm = async (data: UserDataFormProps) => {
    try {
      const dataCrypt = FormsCrypt.dataCrypt({ ...data, userId: dataUser.id })
      const res = await api.post('system/user/update-user/save-update', dataCrypt)

      toast({
        title: 'Sucesso',
        description: res.data.message,
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })

      modalConfirmation.onClose()

      refetchUserAccessesList()
      refetchListUsers()
    } catch (error) {
      return toast({
        title: 'Erro ao atualizar usuário (500)',
        description: 'Tente novamente',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <form id="userUpdateForm" onSubmit={handleSubmit(handleUpdateUserForm)}>
      <FormControl>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Text as="label" htmlFor="name" fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Nome:
              </Text>
              <Input id="name" mb={4} onChange={onChange} value={value} placeholder="nome" />
            </>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Text as="label" htmlFor="email" fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Email:
              </Text>
              <Input id="email" mb={4} onChange={onChange} value={value} placeholder="email" />
            </>
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Text as="label" htmlFor="username" fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Usuário:
              </Text>
              <Input id="username" mb={4} onChange={onChange} value={value} placeholder="usuário" />
            </>
          )}
        />
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <>
              <Text as="label" htmlFor="active" fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Ativo:
              </Text>
              <Select {...field} value={field.value} cursor="pointer">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
            </>
          )}
        />

        <AccessUpdateForm control={control} watch={watch} setValue={setValue} />

        <Flex justify="end" pb={2}>
          <Button colorScheme="blue" w={{ base: '100%', sm: '150px' }} mr={4} onClick={modalConfirmation.onOpen}>
            Salvar
          </Button>
          <Button variant="ghost" w={{ base: '100%', sm: '150px' }} onClick={onClose}>
            Cancelar
          </Button>
        </Flex>
        <UpdateConfirmationModal isOpen={modalConfirmation.isOpen} onClose={modalConfirmation.onClose} />
      </FormControl>
    </form>
  )
}

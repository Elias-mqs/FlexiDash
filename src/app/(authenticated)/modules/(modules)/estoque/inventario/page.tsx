'use client'

import { Flex, Grid, Spinner, Text } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { BsBookshelf } from 'react-icons/bs'
import { FaCogs, FaArchive } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCardResource } from '@/components/ui'
import InventoryProvider from '@/context/Inventory/InventoryContext'
import { useAccessUser, ListResourceProps } from '@/context/SystemLists/AccessUserContext'
import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

const resourceDetails: Record<string, { icon: IconType; route: string }> = {
  Gerenciar: { icon: FaCogs, route: '/modules/estoque/inventario/status-inventario' },
  Prateleiras: { icon: BsBookshelf, route: '/modules/estoque/inventario/shelf' }, /// EXEMPLO DE OUTRAS ROTINAS
  Arquivamento: { icon: FaArchive, route: 'arquivamento' }, /// EXEMPLO DE OUTRAS ROTINAS
}

/// Busca o acesso dos recursos do inventário
const availableResources = async (dataList: ListResourceProps[]) => {
  try {
    const resourcesCrypt = FormsCrypt.dataCrypt({ dataList })

    const res = await api.post('modules/stock/inventory/accessPermissions', resourcesCrypt)

    const listResourceInventory: { listResourceInventory: ListResourceProps[]; status: string } =
      await FormsCrypt.verifyData(res.data)

    return listResourceInventory
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching accessPermissions HomeInventory')
  }
}

export default function HomeInventory() {
  const { useListResource } = useAccessUser()
  const dataUser = useUserData()

  const queryClient = useQueryClient()

  const resourceList = useListResource()

  /// Busca opções disponiveis na rotina inventário
  const { data: dataInventory } = useQuery<{ listResourceInventory: ListResourceProps[]; status: string }>({
    queryKey: ['access-permissions-resource', resourceList],
    queryFn: async () => {
      const dataInventory = await availableResources(resourceList!)

      /// Invalidar a query do drop menu força um refetch para atualizar o button das prateleiras
      queryClient.invalidateQueries({ queryKey: ['sub-menu-sidebar', 'fetch-item-menu', dataUser.id] })

      return dataInventory
    },
    refetchOnWindowFocus: false,
    enabled: (resourceList?.length ?? 0) > 0,
  })

  if (!dataInventory || dataInventory.listResourceInventory.length === 0) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  /// Lista recursos que estiverem disponíveis de acordo com o status do inventário e as permissões do usuario
  return (
    <InventoryProvider>
      <Flex w="100%" direction="column" p={4} overflow="auto">
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={8}
          px={{ base: 0 }}
        >
          {dataInventory.listResourceInventory?.map((resource) => {
            const resourceName = resource?.sis_recurso_rotina?.nome
            const { icon } = resourceDetails[resourceName] || {}
            return (
              <ScreenCardResource
                key={resource.id}
                icon={icon}
                title={resourceName}
                route={resource.sis_recurso_rotina?.slug}
              />
            )
          })}
        </Grid>
      </Flex>
    </InventoryProvider>
  )
}

'use client'

import { Skeleton, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { CloseInventory, StartInventory } from '@/components/ui/Modules/Estoque/Inventario'
import { api } from '@/services'

interface InventoryData {
  status: boolean | undefined
  document: string
}

export default function StatusInventory() {
  const { data } = useQuery<InventoryData | undefined>({
    queryKey: ['verify-status'],
    queryFn: async () => {
      try {
        const response = await api.get('modules/stock/inventory/verifyStatus')

        return response.data
      } catch (error) {
        console.error(error)
      }
    },
    initialData: { status: undefined, document: '' },
  })

  if (data?.status === undefined) {
    return (
      <Stack w="100%" h="100vh" mt={8}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }

  return data.status ? <CloseInventory document={data.document} /> : <StartInventory />
}

/// /////////////// NOME DESSE RECURSO VAI SER "Iniciar/Encerrar Inventário" E O SLUG VAI SER "status-inventario"

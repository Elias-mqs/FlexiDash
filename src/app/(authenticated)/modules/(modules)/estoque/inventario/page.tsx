'use client'

import { Flex, Grid } from '@chakra-ui/react'
import { FaClipboardList, FaBox, FaArchive } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCardResource } from '@/components/ui'
import { useAccessUser } from '@/context/SystemLists/AccessUserContext'

const resourceDetails: Record<string, { icon: IconType; route: string }> = {
  'Iniciar / Encerrar': { icon: FaClipboardList, route: '/modules/estoque/inventario/status-inventario' },
  Estoque: { icon: FaBox, route: 'estoque' }, /// EXEMPLO DE OUTRAS ROTINAS
  Arquivamento: { icon: FaArchive, route: 'arquivamento' }, /// EXEMPLO DE OUTRAS ROTINAS
}

export default function HomeInventory() {
  const { useListResource } = useAccessUser()

  const resourceList = useListResource()

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={8}
        px={{ base: 0, sm: 8 }}
      >
        {resourceList?.map((resource) => {
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
  )
}

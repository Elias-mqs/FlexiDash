'use client'

import { Flex, Grid } from '@chakra-ui/react'
import { FaBox, FaClipboardList, FaArchive } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCardRoutine } from '@/components/ui'
import { useAccessUser } from '@/context/SystemLists/AccessUserContext'

const routineDetails: Record<string, { icon: IconType; route: string }> = {
  Inventário: { icon: FaClipboardList, route: '/modules/estoque/inventario' },
  Estoque: { icon: FaBox, route: 'estoque' }, /// EXEMPLO DE OUTRAS ROTINAS
  Arquivamento: { icon: FaArchive, route: 'arquivamento' }, /// EXEMPLO DE OUTRAS ROTINAS
}

export default function Estoque() {
  const { useListRoutine } = useAccessUser()
  const routineList = useListRoutine()

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
        {routineList?.map((routine) => {
          const accessData = {
            acsRoutineId: routine.id,
            routineId: routine.sis_rotinas?.id,
            slug: routine.sis_rotinas?.slug,
          }
          const routineName = routine?.sis_rotinas?.nome
          const { icon } = routineDetails[routineName] || {}
          return <ScreenCardRoutine key={routine.id} icon={icon} title={routineName} accessData={accessData} />
        })}
      </Grid>
    </Flex>
  )
}

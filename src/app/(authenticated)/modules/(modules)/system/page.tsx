'use client'

import { Flex, Grid, Spinner, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { FaUsers } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCardRoutine } from '@/components/ui'
import { useAccessUser } from '@/context/SystemLists/AccessUserContext'

const routineDetails: Record<string, { icon: IconType; route: string }> = {
  Usuários: { icon: FaUsers, route: '/modules/system/users' },
}

export default function System() {
  const { useListRoutine } = useAccessUser()
  const routineList = useListRoutine()

  if (!routineList || routineList?.length === 0) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      {/* <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}> */}
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={8}
      >
        {routineList.map((routine) => {
          const accessData = {
            acsRoutineId: routine.id,
            routineId: routine.sis_rotinas?.id,
            slug: routine.sis_rotinas?.slug,
          }
          const routineName = routine.sis_rotinas?.nome
          const { icon } = routineDetails[routineName] || {}
          return <ScreenCardRoutine key={routine.id} icon={icon} title={routineName} accessData={accessData} />
        })}
      </Grid>
    </Flex>
  )
}

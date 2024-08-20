'use client'

import { Flex, Grid, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { FaBox, FaClipboardList, FaArchive } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCard } from '@/components/ui'
import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

interface ListRoutineProps {
  id: number
  sis_rotinas: {
    id: number
    nome: string
  }
}

const routineDetails: Record<string, { icon: IconType; description: string }> = {
  Inventário: { icon: FaClipboardList, description: 'Realize e controle inventários' },
  Estoque: { icon: FaBox, description: 'Gerencie o inventário de produtos' }, /// EXEMPLO DE OUTRAS ROTINAS
  Arquivamento: { icon: FaArchive, description: 'Organize e arquive documentos' }, /// EXEMPLO DE OUTRAS ROTINAS
}

export default function Estoque() {
  const dataUser = useUserData()
  const toast = useToast()

  async function fetchListRoutine() {
    const dataAcsMod = Cookies.get('acsModData')

    try {
      const { data } = await api.post('/modules/listRoutines', { data: dataAcsMod, usrId: dataUser.id })

      const dataList = FormsCrypt.verifyData(data)

      return dataList as ListRoutineProps[]
    } catch (error: unknown) {
      toast({
        title: 'Erro interno',
        description: 'Contate a TI',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
      return []
    }
  }

  const { data: routineList } = useQuery({
    queryKey: ['acsModData'],
    queryFn: fetchListRoutine,
    enabled: true,
    refetchOnWindowFocus: false,
  })

  if (!routineList) return

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
        {routineList?.map((routine) => {
          const routineName = routine?.sis_rotinas?.nome
          const { icon, description } = routineDetails[routineName] || {}
          return <ScreenCard key={routine.id} icon={icon} title={routineName} description={description} />
        })}
      </Grid>
    </Flex>
  )
}

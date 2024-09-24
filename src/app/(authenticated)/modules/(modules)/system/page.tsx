'use client'

import { Button, Flex } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { useAccessUser } from '@/context/SystemLists/AccessUserContext'
import { FormsCrypt } from '@/services'

export default function System() {
  const { useListRoutine } = useAccessUser()
  const routineList = useListRoutine()

  const router = useRouter()

  function redirect() {
    const { data } = FormsCrypt.dataCrypt({ acsRtnId: routineList![0].id, routineId: routineList![0].sis_rotinas.id })

    Cookies.set('acsRtnData', data)

    router.push('/modules/system/users')
  }

  return (
    <Flex direction="column" gap={8}>
      Página system
      <Button onClick={redirect}>Ir para Users</Button>
    </Flex>
  )
}

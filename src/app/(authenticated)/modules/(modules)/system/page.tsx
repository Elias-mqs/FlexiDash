'use client'

import { useAccessUser } from '@/context/SystemLists/AccessUserContext'
import { FormsCrypt } from '@/services'
import { Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function System() {

  const { useListRoutine } = useAccessUser()
  const routineList = useListRoutine()

  const router = useRouter()

  function redirect(){
    const { data } = FormsCrypt.dataCrypt({ acsRtnId: routineList![0].id, routineId: routineList![0].id })
    
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

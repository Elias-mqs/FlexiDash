'use client'

import { useAccessUser } from '@/context/SystemLists/AccessUserContext'
import { FormsCrypt } from '@/services'
import { Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function System() {
  const router = useRouter()

  function redirect(){    
    router.push('/modules/system/users/register')
  }


  return (
    <Flex direction="column" gap={8}>
      Página system
      <Button onClick={redirect}>Ir para Register</Button>
    </Flex>
  )
}

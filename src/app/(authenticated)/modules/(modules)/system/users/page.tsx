'use client'

import { Button, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function System() {
  const router = useRouter()

  function redirect() {
    router.push('/modules/system/users/register')
  }

  return (
    <Flex direction="column" gap={8}>
      Página system
      <Button onClick={redirect}>Ir para Register</Button>
    </Flex>
  )
}

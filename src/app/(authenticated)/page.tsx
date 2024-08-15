'use client'

import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Flex w="100%" align="center" justify="center" direction="column" gap={4}>
      <Text>Selecionar módulo: </Text>
      <Text fontSize={24} fontWeight={500}>
        Inventario
      </Text>
      <Button colorScheme="blue" onClick={() => router.push('/modules/inventario/')}>
        Acessar
      </Button>
    </Flex>
  )
}

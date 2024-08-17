'use client'

import { Button, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ListModules } from '@/components/ui/System'
import { api, FormsCrypt } from '@/services'

export default function Modules() {
  const router = useRouter()

  async function chamarApi() {
    const res = await api.get('/system/listModules')
    console.log(res)
    const data = FormsCrypt.verifyData(res.data)
    console.log(data)
  }

  return (
    <Flex h="100vh" w="100%" align="center" justify="center" direction="column">
      <Flex flex="1" align="center" my={4}>
        <Image alt="Logo H2L" src="/img/LOGO-H2L.png" width={200} height={90} priority />
      </Flex>

      <Flex flex="3" direction="column" gap={8} px={8} justify="center" mt={-4}>
        <Text fontSize={18} fontWeight={500}>
          Selecionar módulo:
        </Text>

        <ListModules />

        <Button w="100%" colorScheme="blue" onClick={() => router.push('/modules/inventario/')}>
          Acessar
        </Button>
      </Flex>

      <Button onClick={() => chamarApi()}>Chamar api</Button>

      <Flex flex="1" align="end">
        <Text fontWeight={600} fontSize={14} mb={8} mt={8}>
          © 2024 H2L. Todos os direitos reservados.
        </Text>
      </Flex>
    </Flex>
  )
}

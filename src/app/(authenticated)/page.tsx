'use client'

import { Button, Flex, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { ListModules } from '@/components/ui/System'
import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

interface AcsModuleProps {
  acsModId: number
  mod_id: number
  module: string
}

const moduleSchema = z.object({
  module: z.string(),
})

export default function Modules() {
  const router = useRouter()

  const dataUser = useUserData()

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: { module: '' },
  })

  const selectModule = async (module: { module: string }) => {
    const acsModule: AcsModuleProps = JSON.parse(module.module)
    console.log(acsModule)
    const secureForm = FormsCrypt.dataCrypt({ ...acsModule, usrId: dataUser?.id })
    try {
      const {
        data: { data },
      } = await api.post('/system/selectModule', secureForm)
      router.push(`/modules/${acsModule.module.toLowerCase()}?routines=${data}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex h="100vh" w="100%" align="center" justify="center" direction="column">
      <Flex flex="1" align="center" my={4}>
        <Image alt="Logo H2L" src="/img/LOGO-H2L.png" width={200} height={90} priority />
      </Flex>

      <Flex
        as="form"
        onSubmit={handleSubmit(selectModule)}
        flex="3"
        direction="column"
        gap={8}
        px={8}
        justify="center"
        mt={-4}
      >
        <Text fontSize={18} fontWeight={500}>
          Selecionar módulo:
        </Text>

        <Controller name="module" control={control} render={({ field }) => <ListModules field={{ ...field }} />} />

        <Button type="submit" w="100%" colorScheme="blue">
          Acessar
        </Button>
      </Flex>

      <Flex flex="1" align="end">
        <Text fontWeight={600} fontSize={14} mb={8} mt={8}>
          © 2024 H2L. Todos os direitos reservados.
        </Text>
      </Flex>
    </Flex>
  )
}

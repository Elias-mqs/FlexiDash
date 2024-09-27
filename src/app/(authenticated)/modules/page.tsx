'use client'

import { Button, Flex, Select, Spinner, Text, useToast } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { api, FormsCrypt } from '@/services'

interface DataModuleProps {
  mod_id: number
  moduleName: string
  acsModId: number
  slug: string
}

interface ListModulesProps {
  id: number
  mod_id: number
  sis_modulos?: {
    nome?: string
    slug?: string
  }
}

const moduleSchema = z.object({
  module: z.string(),
})

export default function Modules() {
  const router = useRouter()
  const toast = useToast()

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: { module: '' },
  })

  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  /// //////////////////// Busca os módulos que o usuário tem permissão de aceso ////////////////////
  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  const fetchModules = async () => {
    try {
      const res = await api.get('/system/listModules')

      const data = FormsCrypt.verifyData(res.data)

      return data as ListModulesProps[]
    } catch (error) {
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

  const { data: listMod } = useQuery({
    queryKey: ['acsModData'],
    queryFn: fetchModules,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  })

  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  /// //////////////////// Converte as informações do módulo de json para string ////////////////////
  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  const coerceString = (data: ListModulesProps) => {
    const dataList = { ...data, moduleName: data.sis_modulos?.nome, acsModId: data.id, slug: data.sis_modulos?.slug }
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
      sis_modulos,
      ...dataMod
    } = dataList!
    return JSON.stringify(dataMod)
  }

  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  /// ////////////////////// Seleciona o módulo e seta permissões nos cookies ///////////////////////
  /// ///////////////////////////////////////////////////////////////////////////////////////////////
  const selectModule = async ({ module }: { module: string }) => {
    const dataModule: DataModuleProps = JSON.parse(module)

    const dataModCrypt = FormsCrypt.dataCrypt({ data: { modId: dataModule.mod_id, acsModId: dataModule.acsModId } })
    Cookies.set('acsModData', dataModCrypt.data)
    router.push(`/modules/${dataModule.slug}`)
  }

  return (
    <Flex h="100vh" w="100%" align="center" justify="center" direction="column">
      <Flex flex="1" align="center" my={4}>
        <Image alt="Logo H2L" src="/img/LOGO-H2L.png" width={200} height={90} priority />
      </Flex>

      {!listMod ? (
        <Flex flex="3" direction="column" align="center" justify="center">
          <Text fontWeight="bold">Carregando...</Text>
          <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Flex>
      ) : (
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

          <Controller
            name="module"
            control={control}
            render={({ field }) => (
              <Select
                bg="#f0f0f0"
                placeholder="Módulos"
                color="#000"
                focusBorderColor="blue.300"
                border="2px solid #c0c0c0"
                required
                {...field}
              >
                {listMod?.map((modules, index) => (
                  <option
                    value={coerceString(modules)}
                    key={index}
                    style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}
                  >
                    {modules?.sis_modulos?.nome}
                  </option>
                ))}
              </Select>
            )}
          />

          <Button type="submit" w="100%" colorScheme="blue">
            Acessar
          </Button>
        </Flex>
      )}

      <Flex flex="1" align="end">
        <Text fontWeight={600} fontSize={14} mb={8} mt={8}>
          © 2024 H2L. Todos os direitos reservados.
        </Text>
      </Flex>
    </Flex>
  )
}

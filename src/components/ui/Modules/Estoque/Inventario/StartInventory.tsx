import { Button, Flex, Grid, Input, useToast, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUserData } from '@/context/User/UserDataContext'
import { FormsCrypt, api } from '@/services'

import { Armazens } from './getArmaz'
import { TeamMembers } from './TeamMembers'

const newInventorySchema = z.object({
  document: z.coerce.string().max(9),
  armaz: z.coerce.string().max(2),
  teamMemberId: z.array(z.coerce.number()),
})

type StartNewInventory = z.infer<typeof newInventorySchema>

export function StartInventory() {
  const toast = useToast()
  const router = useRouter()
  const dataUser = useUserData()

  const { handleSubmit, control, resetField, setValue } = useForm<StartNewInventory>({
    resolver: zodResolver(newInventorySchema),
    defaultValues: { document: '', armaz: '', teamMemberId: [] },
  })

  const handleForm = async (data: StartNewInventory) => {
    const formCrypt = FormsCrypt.dataCrypt({ ...data, usrId: dataUser.id })

    try {
      // VOU ADICIONAR MAIS UMAS VARIAVEIS SÓ PARA TESTAR A API
      await api.post('modules/stock/inventory/startInventory', formCrypt)

      toast({
        title: 'Sucesso!',
        description: 'Inventário iniciado',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })

      resetField('document')
      resetField('armaz')
      resetField('teamMemberId')

      router.push(`/modules/estoque/inventario`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return toast({
        title: error.data?.title,
        description: error.data?.message,
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex w="100%" overflow="auto" direction="column" align="center">
      <Grid
        as="form"
        onSubmit={handleSubmit(handleForm)}
        w={'100%'}
        maxW="container.md"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={{ base: 1, md: 2, lg: 4 }}
      >
        <Controller
          name="document"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Flex w="100%" minW="140px" p={2} direction="column">
              <Text fontWeight={600} fontSize={14} pb={1} pl={2} color="gray.500">
                Código inventário:
              </Text>

              <Input
                value={value}
                maxLength={9}
                onChange={(e) => onChange(e.target.value.trim().toUpperCase())}
                size="md"
                focusBorderColor="blue.300"
                placeholder="Documento"
                required
              />
            </Flex>
          )}
        />

        <Controller
          name="armaz"
          control={control}
          render={({ field }) => (
            <Flex w="100%" p={2} direction="column">
              <Text fontWeight={600} fontSize={14} pb={1} pl={2} color="gray.500">
                Armazém:
              </Text>

              <Armazens field={field} />
            </Flex>
          )}
        />

        <Flex w="100%" p={2} direction="column">
          <Text fontWeight={600} fontSize={14} pb={1} pl={2} color="gray.500">
            Membros da equipe:
          </Text>

          <TeamMembers setValue={setValue} />
        </Flex>

        <Flex w="100%" p={2} align="end" justify="center">
          <Button w="100%" type="submit" colorScheme="blue" bg="blue.300" borderRadius={16}>
            Iniciar inventário
          </Button>
        </Flex>
      </Grid>

      <Flex align="center" justify="center" direction="column" mt={6}>
        <Image src="/img/logistic.png" alt="Ilustração de campo de busca" width={700} height={410} priority />
        <Text fontFamily="cursive" fontSize={28} fontWeight={600} color="#7d7d7d" textAlign="center">
          Inicie um novo inventário
        </Text>
      </Flex>
    </Flex>
  )
}

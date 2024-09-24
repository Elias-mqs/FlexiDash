'use client'

import { useState } from 'react'

import { Button, Checkbox, Flex, Grid, Input, Text, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'

import { api, FormsCrypt } from '@/services'

interface FormProps {
  name: string
  email: string
  username: string
  pass: string
}

export default function UserRegister() {
  const toast = useToast()

  // Gerencia o estado do item ativo, que armazena o índice do item ativo
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const { data } = useQuery({
    queryKey: ['list-access-user-register', activeIndex],
    queryFn: async () => {
      try {
        const res = api.post('system/user/access-list-user', { activeIndex })
        console.log(res)
      } catch (error) {
        console.error('Error fetch access list')
      }
    },
  })

  console.log(data)

  const { handleSubmit, control } = useForm({
    defaultValues: { name: '', email: '', username: '', pass: '' },
  })

  const handleRegister = async (data: FormProps) => {
    const formResgister = FormsCrypt.dataCrypt(data)

    try {
      const res = await api.post('system/user/register', formResgister)

      toast({
        title: 'Sucesso!',
        description: res.data.message,
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
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

  const handleItemClick = (index: number) => {
    setActiveIndex(index) // Define o item clicado como ativo
  }

  const columnsGrid = { base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }

  const listPermissions = [
    { id: 1, name: 'Estoque' },
    { id: 2, name: 'Sistema' },
    { id: 3, name: 'Financeiro' },
    { id: 4, name: 'Administrativo' },
  ]

  return (
    <Flex w="100%" px={2} pb={2} direction="column" align="center" gap={8} overflow="auto">
      <Grid
        as="form"
        w="100%"
        maxW="container.xl"
        onSubmit={handleSubmit(handleRegister)}
        templateColumns={columnsGrid}
        gap={4}
        mt={4}
      >
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Nome:
              </Text>
              <Input value={value} onChange={onChange} placeholder="nome" />
            </Flex>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Email:
              </Text>
              <Input type="email" value={value} onChange={onChange} placeholder="email" />
            </Flex>
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Usuário:
              </Text>
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
                placeholder="usuario"
              />
            </Flex>
          )}
        />

        <Controller
          name="pass"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Senha:
              </Text>
              <Input type="password" value={value} onChange={onChange} placeholder="senha" />
            </Flex>
          )}
        />

        <Button type="submit" colorScheme="blue">
          Cadastrar
        </Button>
      </Grid>

      <Flex w="100%" maxW="container.xl" flex="1">
        <Flex as="aside" flex="1" direction="column" borderRight="1px solid #f0f0f0">
          <Text as="h2" p={2} fontSize={14} fontWeight="bold">
            Acessos
          </Text>

          <Flex as="ul" gap={2} mt={2} direction="column">
            {['Módulos', 'Rotinas', 'Recursos'].map((item, index) => (
              <Flex
                key={item}
                as="li"
                py={1}
                pl={2}
                bg={activeIndex === index ? 'gray.200' : 'transparent'} // Define a cor de fundo do item ativo
                borderLeft="3px solid #63b3ed"
                _hover={{ cursor: 'pointer', bg: '#EDF2F7' }}
                onClick={() => handleItemClick(index)} // Chama a função para mudar o estado ativo
              >
                <Text fontWeight={500}>{item}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
          <Text as="h2" fontSize={14} fontWeight="bold">
            Permissões
          </Text>
          {listPermissions.map((item) => (
            <Checkbox key={item.id} fontWeight={500}>
              {item.name}
            </Checkbox>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

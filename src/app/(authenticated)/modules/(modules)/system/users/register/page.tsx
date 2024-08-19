'use client'

import { Button, Flex, Input, Text, useToast } from '@chakra-ui/react'
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

  const { handleSubmit, control } = useForm({
    defaultValues: { name: '', email: '', username: '', pass: '' },
  })

  const handleRegister = async (data: FormProps) => {
    const formResgister = FormsCrypt.dataCrypt(data)

    try {
      const res = await api.post('system/register', formResgister)

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

  return (
    <Flex w="100%" direction="column" align="center">
      <Flex as="form" onSubmit={handleSubmit(handleRegister)} direction="column" gap={4} mt={8}>
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
      </Flex>
    </Flex>
  )
}

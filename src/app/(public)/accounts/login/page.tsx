'use client'

import { useState } from 'react'

import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { FaUser, FaLock } from 'react-icons/fa'
import { IoMdEye } from 'react-icons/io'
import { RiEyeCloseLine } from 'react-icons/ri'
import { z } from 'zod'

import { FormsCrypt, api } from '@/services'

const loginSchema = z.object({
  username: z.string().min(5, 'Mínimo 5 carateres'),
  pass: z
    .string()
    .min(10, 'A senha deve ter no mínimo 10 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caracter especial'),
})

export default function Login() {
  const toast = useToast()
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', pass: '' },
  })

  const [show, setShow] = useState(false)

  const handleLogin = async (data: { username: string; pass: string }) => {
    const dataForm = FormsCrypt.dataCrypt(data)

    try {
      await api.post('system/login', dataForm)

      router.push('/modules')
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
    <Flex justify="center" bg="#d0d0d0" overflow="auto">
      <VStack h="100vh" w="container.lg">
        <Flex direction="column" flex="1" align="center">
          <Flex flex="1" align="center" my={4}>
            <Image alt="Logo H2L" src="/img/LOGO-H2L.png" width={200} height={90} priority />
          </Flex>

          <Flex
            as="form"
            onSubmit={handleSubmit(handleLogin)}
            flex="3"
            direction="column"
            gap={6}
            px={8}
            justify="center"
            mt={-4}
          >
            <Text textAlign="center" fontSize={32} fontWeight={400} color="gray.600" my={4}>
              Bem-vindo
            </Text>

            <Controller
              name="username"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Flex direction="column">
                  <Text pb={1} pl={2} fontSize={14} fontWeight={500}>
                    Usuário
                  </Text>

                  <InputGroup size="lg">
                    <InputLeftElement>
                      <FaUser size={16} />
                    </InputLeftElement>

                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
                      size="lg"
                      bg="#e0e0e0"
                      border="1px solid #000"
                      placeholder="usuário"
                    />
                  </InputGroup>
                  {errors.username && (
                    <Text color="red" fontSize={14} pt={1} pl={2}>
                      {errors.username.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Controller
              name="pass"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Flex direction="column">
                  <Text pb={1} pl={2} fontSize={14} fontWeight={500}>
                    Senha
                  </Text>

                  <InputGroup size="lg">
                    <InputLeftElement>
                      <FaLock size={16} />
                    </InputLeftElement>

                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value.trim())}
                      type={show ? 'text' : 'password'}
                      size="lg"
                      bg="#e0e0e0"
                      border="1px solid #000"
                      placeholder="**********"
                    />

                    <InputRightElement
                      onClick={(e) => {
                        e.preventDefault()
                        setShow(!show)
                      }}
                      cursor="pointer"
                      _hover={{ color: 'blue.600' }}
                    >
                      {show ? <IoMdEye size={22} /> : <RiEyeCloseLine />}
                    </InputRightElement>
                  </InputGroup>
                  {errors.pass && (
                    <Text maxW="300px" color="red" fontSize={14} pt={1} pl={2}>
                      {errors.pass.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Flex direction="column" gap={4} mt={2}>
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                _hover={{ transform: 'translateY(-2px)' }}
                _active={{ transform: 'translateY(2px)' }}
              >
                Entrar
              </Button>

              <Text
                h={6}
                mt={{ base: 4, sm: 0 }}
                textAlign="center"
                fontSize={14}
                fontWeight={500}
                color="blue.700"
                cursor="pointer"
                transition="all .05s linear"
                _hover={{ fontWeight: 600, transform: 'scale(1.1)' }}
              >
                Esqueceu a senha?
              </Text>
            </Flex>
          </Flex>

          <Flex flex="1" align="end">
            <Text fontWeight={600} fontSize={14} mb={8} mt={8}>
              © 2024 H2L. Todos os direitos reservados.
            </Text>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  )
}

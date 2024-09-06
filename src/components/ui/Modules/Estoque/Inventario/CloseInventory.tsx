'use client'

import { useState } from 'react'

import {
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaCheck, FaMinusCircle, FaEdit } from 'react-icons/fa'
import { RiErrorWarningLine, RiCloseLine } from 'react-icons/ri'

import { useUserData } from '@/context/User/UserDataContext'
import { api, FormsCrypt } from '@/services'

import { EditDocument } from './EditDocument'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CloseInventory(data: { document: string; armaz: string; refetch: any }) {
  const dataUser = useUserData()
  const toast = useToast()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeModal, setActiveModal] = useState('')

  const handleOpen = (modalType: string) => {
    setActiveModal(modalType)
    onOpen()
  }

  const handleCloseInv = async () => {
    const updateCrypt = FormsCrypt.dataCrypt({ document: data.document, userId: dataUser.id })

    try {
      await api.post('modules/stock/inventory/closeInventory', updateCrypt)

      toast({
        title: 'Inventário encerrado',
        description: '',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })

      router.push('modules/estoque/inventario')
    } catch (error) {
      toast({
        title: 'Erro ao encerrar - contate a TI',
        description: '',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex w="100%" overflow="auto" direction="column" align="center">
      <Flex
        w="100%"
        border="2px solid #BDC3C7"
        borderRadius="1rem"
        direction="column"
        bg="#ECF0F1"
        p={2}
        boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
      >
        <Flex w="100%" justify="space-between" align="center" py={{ base: 2, md: 0 }}>
          <Flex h={6} px={4}>
            <Tag colorScheme="yellow" borderRadius="full">
              Em andamento
            </Tag>
          </Flex>

          <Tooltip hasArrow placement="left" label="Editar">
            <Button
              bg="transparent"
              p={2}
              boxSize="32px"
              color="gray.800"
              borderRadius="2rem"
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
              onClick={() => handleOpen('edit')}
            >
              <FaEdit fontSize={20} />
            </Button>
          </Tooltip>
        </Flex>

        <Flex gap={12} p={2} justify="space-between" direction={{ base: 'column', md: 'row' }}>
          <Flex gap={4} ml={{ base: 0, md: 4 }} direction={{ base: 'column', md: 'row' }}>
            <Flex direction="column">
              <Text pl={2} fontSize={14} fontWeight={600} color="#727c7d">
                N° Inventário:
              </Text>

              <Text
                fontSize={20}
                fontWeight={600}
                color="#1E3A8A"
                border="1px solid #a0a0a0"
                py={1}
                pr={{ base: 8, sm: 2, md: 8 }}
                pl={4}
                w={{ base: '100%', sm: '50%', md: 'auto' }}
                bg="#fff"
                borderRadius=".5rem"
              >
                {data.document}
              </Text>
            </Flex>

            <Flex direction="column">
              <Text pl={2} fontSize={14} fontWeight={600} color="#727c7d">
                Armazém:
              </Text>

              <Text
                fontSize={20}
                fontWeight={600}
                color="#1E3A8A"
                border="1px solid #a0a0a0"
                py={1}
                pr={12}
                pl={4}
                w={{ base: '100%', sm: '50%', md: 'auto' }}
                bg="#fff"
                borderRadius=".5rem"
              >
                {data.armaz}
              </Text>
            </Flex>
          </Flex>

          <Flex justify="end" align="end" mr={{ base: 0, md: 8 }} gap={8}>
            <Button
              colorScheme="red"
              gap={2}
              p={4}
              w={{ base: '100%', sm: 'auto' }}
              borderRadius="2rem"
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
              onClick={() => handleOpen('closeInventory')}
            >
              <FaMinusCircle fontSize={18} />
              Encerrar
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" justify="center" direction="column" my={{ base: 14, md: 10 }}>
        <Image
          src="/img/undraw_updated-removebg.png"
          alt="Ilustração de campo de busca"
          width={450}
          height={324}
          priority
        />

        <Text px={8} fontFamily="cursive" fontSize={28} fontWeight={600} color="#7d7d7d" textAlign="center">
          Atualizar inventário
        </Text>
      </Flex>

      <EditDocument
        isOpen={isOpen && activeModal === 'edit'}
        onClose={onClose}
        document={data.document}
        armaz={data.armaz}
        refetch={data.refetch}
      />
      <CloseModal isOpen={isOpen && activeModal === 'closeInventory'} onClose={onClose} closeInv={handleCloseInv} />
    </Flex>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CloseModal({ isOpen, onClose, closeInv }: any) {
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx={4} bgGradient="linear(to-b, red.100, white)">
        <ModalHeader borderBottom="1px solid #d5d5d5" mx={4} pb={2}>
          <Flex ml={-6} p={2} bg="red.100" borderRadius="full" w="62px">
            <Flex p={2} bg="red.200" borderRadius="full">
              <RiErrorWarningLine color="red" fontSize={30} />
            </Flex>
          </Flex>
          <Text ml={-4} mt={2} fontSize={22} fontWeight={700}>
            Confirmar encerramento
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <Flex p={4} direction="column">
          <Text fontWeight={600} fontSize={18} ml={2}>
            Tem certeza que deseja encerrar o inventário?
          </Text>
          <Text fontWeight={500} ml={2}>
            (Você não poderá acessar esse inventário novamente)
          </Text>
          <Flex w="100%" justify="end" mt={4} p={4} pb={2} gap={4}>
            <Button
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="green.500"
              size="sm"
              colorScheme="green"
              gap={2}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
              onClick={closeInv}
            >
              <FaCheck />
              Confirmar
            </Button>
            <Button
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="red.500"
              size="sm"
              colorScheme="red"
              gap={1}
              onClick={onClose}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <RiCloseLine fontSize={22} />
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

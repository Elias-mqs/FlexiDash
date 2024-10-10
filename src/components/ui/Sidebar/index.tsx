'use client'

import { useState } from 'react'

import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FaCheck } from 'react-icons/fa'
import { MdSync } from 'react-icons/md'
import { RiErrorWarningLine, RiCloseLine } from 'react-icons/ri'

import { MenuAccessListProps } from '@/app/api/header/menu-access/route'
import { useLayoutComponent } from '@/context/LayoutComponents/LayoutCompContext'
import { useUserData } from '@/context/User/UserDataContext'
import { FormsCrypt, api } from '@/services'

import { DropMenu } from '../DropMenu'

export function Sidebar() {
  const { toggleSideBar, isExpanded } = useLayoutComponent()
  const dataUser = useUserData()

  const [hoverExpansion, setHoverExpansion] = useState(false) /// Controle de abertura automática da sidebar
  const [openMenu, setOpenMenu] = useState(false) /// Abertura do drop menu

  const pathname = usePathname()

  const changeModuleModal = useDisclosure() /// Controle de abertura do modal de confirmação de mudança de módulo

  /// Busca as opções apresentadas no drop down menu
  const { data: menuAccessList } = useQuery<MenuAccessListProps>({
    queryKey: ['sub-menu-sidebar', 'fetch-item-menu', dataUser.id],
    queryFn: async () => {
      const dataCrypt = FormsCrypt.dataCrypt({ userId: dataUser.id })
      const res = await api.post('header/menu-access', dataCrypt)

      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (!menuAccessList) return

  const splitPathname = pathname.split('/')

  /// As próximas duas são as ações de abertura e fechamento automático da sidebar
  const openSidebar = () => {
    toggleSideBar()
    setHoverExpansion(true)
  }

  const closeSidebar = () => {
    if (hoverExpansion) {
      toggleSideBar()
      setHoverExpansion(false)
    }
  }

  /// Titulo de identificação do módulo atual
  const currentModule = menuAccessList.sis_acess_modulo.find((mod) => mod.sis_modulos.slug === splitPathname[2])

  return (
    <Flex
      as="aside"
      h={{ base: 'auto', md: '100vh' }}
      w={{ base: '100%', md: isExpanded ? '200px' : '70px' }}
      transition="all .4s ease"
      maxW={{ base: 'calc(100vw - 32px)' }}
      maxH={{ base: isExpanded ? '220px' : '0px', md: '100%' }}
      align="center"
      borderBottom="1px solid #d0d0d0"
      py={{ base: isExpanded ? 2 : 0, md: 0 }}
      direction="column"
      gap={2}
      borderRight={{ base: 'none', md: '2px solid #d0d0d0' }}
      onMouseEnter={isExpanded ? () => {} : openSidebar}
      onMouseLeave={closeSidebar}
    >
      <Flex direction="column" overflow="hidden" w="100%" h="auto" mt={{ base: 2, md: 8 }} px={{ base: 0, md: 4 }}>
        <Flex
          as="figure"
          w="100%"
          h="100%"
          justify="center"
          mb={{ base: 0, md: isExpanded ? 8 : 0 }}
          maxH={{ base: '0px', md: isExpanded ? '100%' : '0%' }}
          overflow="hidden"
          transition="all .3s ease-out"
        >
          <Image alt="Logo da H2L - Soluções para Documentos" src="/img/LOGO-H2L.png" width={150} height={67} />
        </Flex>

        <Text
          as="h1"
          display={{ base: 'none', md: 'block' }}
          mb={2}
          color="blue.700"
          fontSize={20}
          fontWeight="semibold"
          h={isExpanded ? 'auto' : '0%'}
          overflow={isExpanded ? 'visible' : 'hidden'}
        >
          {currentModule?.sis_modulos.nome}
        </Text>

        {/* Substitua por itens de menu reais */}
        <Flex as="nav" align="center" direction="column">
          <Box as="ul" w="100%">
            <Flex as="li" borderBottom={{ base: 'none', md: '1px solid #e0e0e0' }}>
              <Button
                as="a"
                w="100%"
                color="gray.500"
                size="sm"
                mb={{ base: 0, md: 2 }}
                cursor="pointer"
                pr={{ base: 6, md: isExpanded ? 6 : 0 }}
                onClick={changeModuleModal.onOpen}
              >
                <Icon mr={{ base: 2, md: isExpanded ? 2 : 4 }} fontSize={20} as={MdSync} />
                <Text display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}>Trocar módulo</Text>
              </Button>
            </Flex>

            <DropMenu
              splitPathname={splitPathname}
              menuAccessList={menuAccessList}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              isExpanded={isExpanded}
            />
          </Box>
        </Flex>
        {/* Adicione mais itens conforme necessário */}
      </Flex>
      <ConfirmChangeModule isOpen={changeModuleModal.isOpen} onClose={changeModuleModal.onClose} />
    </Flex>
  )
}

/// ///////////////////////////////////////////////////////////////////////////////////////////////////
/// /////////////////////////// Modal para confirmar a troca de módulo ///////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////
function ConfirmChangeModule({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()

  const handleChangeModule = () => {
    Cookies.remove('acsModData')
    Cookies.remove('acsRtnData')
    router.push('/modules')
  }

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx={{ base: 6, sm: 4 }} mt={24} bgGradient="linear(to-b, blue.100, white)">
        <ModalHeader borderBottom="1px solid #d5d5d5" mx={4} pb={2}>
          <Flex align="center">
            <Flex ml={-6} p={2} bg="blue.100" borderRadius="full" w="62px">
              <Flex p={2} bg="blue.200" borderRadius="full">
                <RiErrorWarningLine color="blue" fontSize={30} />
              </Flex>
            </Flex>
            <Text ml={4} fontSize={22} fontWeight={700}>
              Atenção
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <Flex p={4} direction="column">
          <Text fontWeight={600} fontSize={18} ml={2}>
            Deseja trocar de módulo?
          </Text>
          <Flex w="100%" justify="end" mt={4} p={4} pb={2} gap={4}>
            <Button
              form="userUpdateForm"
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="green.500"
              size="sm"
              colorScheme="green"
              gap={2}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
              onClick={() => handleChangeModule()}
            >
              <FaCheck />
              Sim
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
              Não
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

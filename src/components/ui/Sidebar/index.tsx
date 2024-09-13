'use client'

import { Button, Flex, Icon } from '@chakra-ui/react'
import { GiHamburgerMenu } from 'react-icons/gi'

import { useLayoutComponent } from '@/context/LayoutComponents/LayoutCompContext'

export function Sidebar() {
  const { toggleSideBar, isExpanded } = useLayoutComponent()

  return (
    <Flex
      h={{ base: '220px', md: '100vh' }}
      w={{ base: '100%', md: isExpanded ? '200px' : '70px' }}
      maxW={{ base: 'calc(100vw - 32px)' }}
      maxH={{ base: isExpanded ? '220px' : '0px', md: '100%' }}
      align="center"
      transition="width 0.5s ease, max-height 0.5s ease"
      position="absolute"
      direction="column"
      gap={2}
      borderRight={{ base: 'none', md: '2px solid #d0d0d0' }}
    >
      <Button
        position="absolute"
        top={{ base: isExpanded ? '220px' : '10px', md: '10px' }}
        right={{ base: '0px', md: '-33px' }}
        w="30px"
        h="30px"
        minW="30px"
        p={0}
        colorScheme="blue"
        borderRadius="full"
        onClick={toggleSideBar}
        transition="top 0.5s ease, right 0.5s ease"
      >
        <Icon as={GiHamburgerMenu} fontSize={14} />
      </Button>

      <Flex direction="column" overflow="hidden" w="100%" gap={8} mt={{ base: 2, md: 8 }} px={{ base: 0, md: 4 }}>
        {/* Substitua por itens de menu reais */}
        <Button h="35px" minH="35px" colorScheme="blue">
          Button 1
        </Button>
        <Button h="35px" minH="35px" colorScheme="green">
          Button 2
        </Button>
        <Button h="35px" minH="35px" colorScheme="red">
          Button 3
        </Button>
        {/* Adicione mais itens conforme necessário */}
      </Flex>
    </Flex>
  )
}

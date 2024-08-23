'use client'

import { useState } from 'react'

import { Button, Flex, Icon } from '@chakra-ui/react'
import { GiHamburgerMenu } from 'react-icons/gi'

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Flex
      h={{ base: '600px', sm: '100vh' }}
      w={{ base: '100%', sm: isExpanded ? '200px' : '70px' }}
      maxH={{ base: isExpanded ? '250px' : '0px', sm: '100%' }}
      align="center"
      transition="width 0.5s ease, max-height 0.5s ease"
      position="relative"
      direction="column"
      gap={2}
      borderRight="2px solid #d0d0d0"
    >
      <Button
        position="absolute"
        top={{ base: isExpanded ? '260px' : '10px', sm: '10px' }}
        right={{ base: '0px', sm: '-30px' }}
        w="30px"
        h="30px"
        minW="30px"
        p={0}
        colorScheme="blue"
        borderRadius="full"
        onClick={toggleSidebar}
        transition="top 0.5s ease, right 0.5s ease"
      >
        <Icon as={GiHamburgerMenu} fontSize={14} />
      </Button>

      <Flex direction="column" overflow="hidden" w="100%" gap={8} mt={8} px={4}>
        {/* Substitua por itens de menu reais */}
        <Button h="35px" minH="35px" colorScheme="blue">
          Button 1
        </Button>
        <Button h="35px" minH="35px" colorScheme="green">
          Button 2
        </Button>
        <Button h="35px" minH="35px" colorScheme="gray">
          Button 3
        </Button>
        {/* Adicione mais itens conforme necessário */}
      </Flex>
    </Flex>
  )
}

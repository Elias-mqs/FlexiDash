import { Button, Flex, Tag, Text, Tooltip } from '@chakra-ui/react'
import Image from 'next/image'
import { FaMinusCircle, FaEdit } from 'react-icons/fa'

export function CloseInventory({ document }: { document: string }) {
  console.log(document)

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
        <Flex w="100%" justify="space-between" align="center">
          <Flex h={6} px={4}>
            <Tag colorScheme="yellow" borderRadius="full">
              Em andamento
            </Tag>
          </Flex>

          <Tooltip hasArrow placement="left" label="Atualizar">
            <Button
              bg="transparent"
              p={2}
              boxSize="32px"
              color="gray.800"
              borderRadius="2rem"
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <FaEdit fontSize={20} />
            </Button>
          </Tooltip>
        </Flex>

        <Flex gap={12} p={2}>
          <Flex flex="1" gap={2} ml={4} align="center" justify="start">
            <Text fontSize={20} fontWeight={600} color="#727c7d">
              N° Inventário:
            </Text>
            <Text
              fontSize={20}
              fontWeight={600}
              color="#1E3A8A"
              border="1px solid #a0a0a0"
              py={1}
              px={2}
              bg="#f9f9f9"
              borderRadius=".5rem"
            >
              {document}
            </Text>
          </Flex>
          <Flex justify="end" mr={8} flex="1" gap={8}>
            <Button
              colorScheme="red"
              gap={2}
              p={4}
              borderRadius="2rem"
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <FaMinusCircle fontSize={18} />
              Encerrar
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" justify="center" direction="column" mt={6}>
        <Image
          src="/img/undraw_updated-removebg.png"
          alt="Ilustração de campo de busca"
          width={600}
          height={433}
          priority
        />
        <Text px={8} fontFamily="cursive" fontSize={28} fontWeight={600} color="#7d7d7d" textAlign="center">
          Atualizar inventário
        </Text>
      </Flex>
    </Flex>
  )
}

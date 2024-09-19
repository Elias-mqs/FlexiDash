import React from 'react'

import { Flex, Card, CardHeader, CardBody, Progress, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { IoSearch } from 'react-icons/io5'

import { ShelfCodProps } from '@/app/(authenticated)/modules/(modules)/estoque/inventario/shelf/page'

const ShelfCard = React.memo(({ shelfData }: { shelfData: ShelfCodProps }) => {
  const textColor = '#a0a0a0'

  const router = useRouter()

  const urlPush = `/modules/estoque/inventario/shelf/shelfDetails/list?codShelf=${shelfData.codPrat}`

  return (
    <Flex w="100%" m={1} onClick={() => router.push(urlPush)}>
      <Card p="1rem" w="100%" bg="#f9f9f9" cursor="pointer">
        <CardHeader p="6px 5px">
          <Flex justify="space-between">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {shelfData.codPrat}
            </Text>
            <IoSearch size="20px" />
          </Flex>
        </CardHeader>
        <CardBody p="0px 5px">
          <Flex direction="column">
            <Flex w="100%" mb={2} gap={4}>
              <Flex>
                <Text fontSize="sm" color={textColor} fontWeight="bold" mr="5px">
                  F:
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  8
                </Text>
              </Flex>

              <Flex>
                <Text fontSize="sm" color={textColor} fontWeight="bold" mr="5px">
                  T:
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  8
                </Text>
              </Flex>
            </Flex>

            <Progress align="start" colorScheme="green" value={80} size="sm" />
            <Text align="start" fontSize="sm" color={textColor} fontWeight="bold" mr="5px" mt={1}>
              80%
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  )
})

ShelfCard.displayName = 'ShelfCard'

export { ShelfCard }

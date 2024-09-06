import { Flex, Card, CardHeader, CardBody, Progress, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { IoSearch } from 'react-icons/io5'

import { ShelfData } from '@/app/(authenticated)/modules/(modules)/estoque/inventario/shelf/page'

export function ShelfCard({ shelfData }: { shelfData: ShelfData }) {
  const textColor = '#a0a0a0'

  const router = useRouter()

  const urlPush = '/modules/estoque/inventario/shelf/shelfDetails/shelfDetails?descpra=A01/01&armaz=01&doc=03082024'

  return (
    <Flex>
      <Card p="1rem" w="100%" bg="#f9f9f9" cursor="pointer" onClick={() => router.push(urlPush)}>
        <CardHeader p="6px 5px">
          <Flex gap={6}>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {shelfData.shelfCod}
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
                  {shelfData.Done}
                </Text>
              </Flex>

              <Flex>
                <Text fontSize="sm" color={textColor} fontWeight="bold" mr="5px">
                  T:
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  {shelfData.Total}
                </Text>
              </Flex>
            </Flex>

            <Progress colorScheme="green" value={shelfData.progress} size="sm" />
            <Text fontSize="sm" color={textColor} fontWeight="bold" mr="5px">
              {shelfData.progress}%
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  )
}

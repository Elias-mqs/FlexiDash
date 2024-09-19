import { Flex, Grid, Input, Text, useDisclosure } from '@chakra-ui/react'
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query'

import {
  ShelfDetailsB7Props,
  ShelfDetailsProps,
} from '@/app/(authenticated)/modules/(modules)/estoque/inventario/shelf/shelfDetails/[shelfDetails]/page'

import { DetailItem } from '../DetailItem'

interface ShelfItemsProps {
  items: ShelfDetailsProps
  existingItems: ShelfDetailsB7Props
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      | false
      | {
          shelfDetails: ShelfDetailsProps[]
          searchProdExist: (ShelfDetailsB7Props | undefined)[]
        },
      Error
    >
  >
}

export function ShelfItems({ items, existingItems, refetch }: ShelfItemsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Grid
      templateColumns="2fr 4fr 1fr 1fr"
      mx={2}
      minW="container.lg"
      gap={4}
      px={4}
      py={2}
      borderTop="1px solid #f0f0f0"
      borderBottom="1px solid #f0f0f0"
    >
      <Flex overflow="hidden" minH="30px" maxH="50px" align="center">
        <Input
          variant="unstyled"
          placeholder={items.codProd}
          onChange={(e) => e.target.value}
          color="gray.500"
          readOnly
        />
      </Flex>

      <Flex overflow="hidden" minH="30px" maxH="50px">
        <Input
          variant="unstyled"
          placeholder={items.descProd}
          onChange={(e) => e.target.value}
          color="gray.500"
          readOnly
        />
      </Flex>

      <Flex overflow="hidden" minH="30px" maxH="50px" align="center" gap={2}>
        <Text
          w="96px"
          wordBreak="break-word"
          textAlign="center"
          fontWeight={500}
          color={items.textColorStatus}
          bg={items.colorStatus}
          px={3}
          py={0.5}
          borderRadius="1rem"
        >
          {items.currentStatus}
        </Text>
      </Flex>

      <Flex align="center" justify="center">
        <Text
          color="blue.600"
          fontSize={14}
          fontWeight={600}
          _hover={{ fontSize: 15, cursor: 'pointer' }}
          onClick={onOpen}
        >
          Alterar
        </Text>
      </Flex>

      <DetailItem items={items} existingItems={existingItems} isOpen={isOpen} onClose={onClose} refetch={refetch} />
    </Grid>
  )
}

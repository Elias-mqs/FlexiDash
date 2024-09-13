import { useState } from 'react'

import { Flex, Grid, Input, Text, useDisclosure } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { ShelfDetailsProps } from '@/app/(authenticated)/modules/(modules)/estoque/inventario/shelf/shelfDetails/[shelfDetails]/page'
import { api, FormsCrypt } from '@/services'

import { DetailItem } from '../DetailItem'

export function ShelfItems({ items }: { items: ShelfDetailsProps }) {
  console.log('=========== renderizando ShelfItems ============')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [statusCount, setStatusCount] = useState<string>('Conferir')

  const { data } = useQuery({
    queryKey: ['status-shelf'],
    queryFn: async () => {
      const dataCrypt = FormsCrypt.dataCrypt(items)
      try {
        const res = await api.post('modules/stock/inventory/updateItemShelf', dataCrypt)
        console.log(res)
        return res.data
      } catch (error) {
        console.error('Erro interno - contate a TI (ShelfItems)')
      }
    },
  })

  console.log(data)

  const updateStatus = (data: string) => {
    setStatusCount(data)
  }

  console.log(items)

  let colorStatus: string = 'yellow'
  let textColorStatus: string = '#757575'

  if (statusCount === 'Revisar') {
    colorStatus = 'red'
    textColorStatus = '#fff'
  }
  if (statusCount === 'Conferido') {
    colorStatus = 'green'
    textColorStatus = '#fff'
  }

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

      {/* <Flex overflow="hidden" minH="30px" maxH="50px" align="center" px={8} py={0}>
        <Input
          title="qtd"
          minW="50px"
          type="number"
          variant="unstyled"
          placeholder={String(qtdCount)}
          onChange={(e) => e.target.value}
          color={items.qtdAtual === qtdCount ? 'red' : 'gray.500'}
          _placeholder={{ color: items.qtdAtual === qtdCount || qtdCount === '-' ? 'gray.500' : 'red' }}
        />
      </Flex> */}

      <Flex overflow="hidden" minH="30px" maxH="50px" align="center" gap={2}>
        {/* <Icon as={iconsStatus} boxSize={5} color="black" bg="yellow" /> */}
        <Text wordBreak="break-word" fontWeight={500} color={textColorStatus} bg={colorStatus} px={3} py={0.5} borderRadius="1rem">
          {statusCount}
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

      <DetailItem items={items} isOpen={isOpen} onClose={onClose} setStatusCount={updateStatus} />
    </Grid>
  )
}

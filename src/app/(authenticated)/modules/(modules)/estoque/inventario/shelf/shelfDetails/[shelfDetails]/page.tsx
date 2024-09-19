'use client'

import { Flex, Grid, Input, Spinner, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { ShelfItems } from '@/components/ui/Inventory'
import { api, FormsCrypt } from '@/services'

export type ShelfDetailsProps = {
  codProd: string
  descProd: string
  qtdAtual: number
  currentStatus: string
  colorStatus: string
  textColorStatus: string
}

export type ShelfDetailsB7Props = {
  codProd: string
  qtdProd: number
}

const fetchShelfDetails = async (descPra: string) => {
  if (!descPra) {
    return false
  }

  try {
    const dataCrypt = FormsCrypt.dataCrypt(descPra)

    const res = await api.post('modules/stock/inventory/shelfDetails', dataCrypt)

    const {
      shelfDetails,
      searchProdExist,
    }: { shelfDetails: ShelfDetailsProps[]; searchProdExist: ShelfDetailsB7Props[] } = FormsCrypt.verifyData(res.data)

    return { shelfDetails, searchProdExist }
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching shelf details')
  }
}

export default function ShelfDetails() {
  const searchParams = useSearchParams()

  const descPra = searchParams.get('codShelf')

  const { data: shelfDetails, refetch } = useQuery({
    queryKey: ['detail-shelf', descPra!],
    queryFn: () => fetchShelfDetails(descPra!),
    enabled: !!descPra, // Somente ativa a query se descPra existir
    refetchOnWindowFocus: false,
  })

  if (!descPra) {
    return (
      <Flex w="100%" justify="start" align="center" direction="column" mt={8} gap={{ base: 8, sm: 0 }}>
        <Image alt="Data not found" src="/img/undraw-not-found.png" width={550} height={365} />
        <Flex maxW="container.md" direction="column" px={2}>
          <Text
            fontFamily="cursive"
            fontSize={{ base: 22, sm: 28 }}
            fontWeight={600}
            color="#7d7d7d"
            textAlign="center"
          >
            Oops! Não estamos encontrando as informações.
          </Text>
          <Text
            fontFamily="cursive"
            fontSize={{ base: 22, sm: 28 }}
            fontWeight={600}
            color="#7d7d7d"
            textAlign="center"
          >
            Verifique os dados e tente novamente.
          </Text>
        </Flex>
      </Flex>
    )
  }

  if (!shelfDetails) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <Flex w="100%" direction="column">
      <Flex w="100%" justify={{ base: 'center', sm: 'end' }} p={4}>
        <Input w="300px" size="md" focusBorderColor="blue.300" placeholder="Pesquisar" color="gray.500" />
      </Flex>

      <Flex direction="column" overflowX="auto">
        <Grid templateColumns="2fr 4fr 1fr 1fr" gap={4} px={4} py={4} mx={2} minW="container.lg">
          <Flex>
            <Text fontWeight={600} fontSize={14} color="#829abf">
              CÓDIGO
            </Text>
          </Flex>

          <Flex>
            <Text fontWeight={600} fontSize={14} color="#829abf">
              DESCRIÇÃO
            </Text>
          </Flex>

          {/* <Flex px={8}>
            <Text fontWeight={600} fontSize={14} color="#829abf">
              QTD
            </Text>
          </Flex> */}

          <Flex>
            <Text pl={2} fontWeight={600} fontSize={14} color="#829abf">
              STATUS
            </Text>
          </Flex>
        </Grid>

        {shelfDetails.shelfDetails.map((data, index) => (
          <ShelfItems key={index} items={data} existingItems={shelfDetails.searchProdExist[index]!} refetch={refetch} />
        ))}
      </Flex>
    </Flex>
  )
}

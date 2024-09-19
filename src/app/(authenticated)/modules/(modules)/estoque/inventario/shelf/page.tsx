'use client'

import { useMemo } from 'react'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window'

import { ShelfCard } from '@/components/ui/Modules/Estoque/Inventario'
import { api } from '@/services'

export type ShelfCodProps = {
  codPrat: string
}

interface ScreenProps {
  columnCount: number
  columnWidth: number
  height: number
  rowCount: (group: string) => number
  width: number
}

export default function ShelfInv() {
  const [isSm] = useMediaQuery('(min-width: 481px) and (max-width: 768px)')
  const [isMd] = useMediaQuery('(min-width: 769px) and (max-width: 992px)')
  const [isLg] = useMediaQuery('(min-width: 993px) and (max-width: 1200px)')
  const [isXl] = useMediaQuery('(min-width: 1201px) and (max-width: 1536px)')
  const [is2xl] = useMediaQuery('(min-width: 1537px)')

  const { data } = useQuery({
    queryKey: ['get-shelves'],
    queryFn: async () => {
      try {
        const response = await api.get('modules/stock/inventory/getShelves')

        return response.data
      } catch (error) {
        console.error(error)
      }
    },
    gcTime: 4 * 60 * 60 * 1000,
    staleTime: 4 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const groupedShelves = useMemo(() => {
    if (data?.listShelves) {
      return groupShelves(data.listShelves)
    }
  }, [data?.listShelves])

  const memoizedGroupedShelves = useMemo(() => {
    if (groupedShelves) {
      return Object.keys(groupedShelves).sort((a, b) => {
        if (a === 'OUTROS') return 1
        if (b === 'OUTROS') return -1
        return a.localeCompare(b)
      })
    }
  }, [groupedShelves])

  if (!data?.listShelves) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  if (!groupedShelves) {
    return
  }

  // Definindo tamanhos de tela para reponsividadde
  let screenSize: ScreenProps
  let numColumns = 5
  if (is2xl) {
    numColumns = 7
    screenSize = {
      columnCount: 7, // Número de colunas
      columnWidth: 200, // Largura de cada item no grid (ajuste conforme necessário)
      height: 720, // Altura total do grid
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      }, // Número de linhas
      width: 1420,
    }
  } else if (isXl) {
    numColumns = 6
    screenSize = {
      columnCount: 6,
      columnWidth: 200,
      height: 720,
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      },
      width: 1220,
    }
  } else if (isLg) {
    numColumns = 4
    screenSize = {
      columnCount: 4,
      columnWidth: 200,
      height: 720,
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      },
      width: 820,
    }
  } else if (isMd) {
    numColumns = 3
    screenSize = {
      columnCount: 3,
      columnWidth: 200,
      height: 720,
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      },
      width: 620,
    }
  } else if (isSm) {
    numColumns = 2
    screenSize = {
      columnCount: 2,
      columnWidth: 200,
      height: 720, // Altura total do grid
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      },
      width: 420,
    }
  } else {
    numColumns = 2
    screenSize = {
      columnCount: 2,
      columnWidth: 160,
      height: 720,
      rowCount: (group) => {
        return Math.ceil(groupedShelves[group].length / numColumns)
      },
      width: 480,
    }
  }

  const renderCell = (group: string) =>
    function CellRenderer({ columnIndex, rowIndex, style }: GridChildComponentProps) {
      // Nomeando a função aqui
      const index = rowIndex * numColumns + columnIndex
      const shelf = groupedShelves[group][index]

      if (!shelf) return null

      return (
        <Flex style={style} key={index}>
          <ShelfCard shelfData={shelf} />
        </Flex>
      )
    }

  return data ? (
    <Stack direction="column" w="100%" p={{ base: 0, md: 8 }}>
      {/* <Text fontSize={50}>Prateleiras</Text> */}
      <Accordion allowMultiple overflow="auto">
        {memoizedGroupedShelves &&
          memoizedGroupedShelves.map((group) => (
            <AccordionItem key={group} transition="all 2s ease">
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {group}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0} align="center">
                <Grid
                  columnCount={screenSize.columnCount} // Número de colunas
                  columnWidth={screenSize.columnWidth} // Largura de cada item no grid (ajuste conforme necessário)
                  height={screenSize.height} // Altura total do grid
                  rowCount={screenSize.rowCount(group)} // Número de linhas
                  rowHeight={140} // Altura de cada linha
                  width={screenSize.width} // Largura total do grid
                  style={{}}
                >
                  {renderCell(group)}
                </Grid>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
      {/* O FLEX ABAIXO É PARA ADICIONAR UM BUTTON DE SCROLL DEPOIS
      <Flex w="100%" justify="end">
        {showScrollButton && (
          <Button
            onClick={scrollToTop}
            w="40px"
            h="40px"
            p={0}
            colorScheme="blue"
            borderRadius="full"
            position="fixed"
            bottom="60px"
            right="24px"
          >
            <IoMdArrowRoundUp size={24} />
          </Button>
        )}
      </Flex> */}
      {/* <ShelfCard shelfData={shelfDataArray} /> */}
    </Stack>
  ) : (
    <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
      <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} />
      <Text fontWeight="bold">Carregando...</Text>
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Flex>
  )
}

// Função para definir o grupo baseado no prefixo da shelf
function getGroupByShelfCod(shelfCod: string): string {
  const prefix = shelfCod.charAt(0).toUpperCase() // Pega o primeiro caractere
  if (['A', 'B', 'C'].includes(prefix)) return 'A / B / C'
  if (['D', 'E', 'F'].includes(prefix)) return 'D / E / F'
  if (['G', 'H', 'I'].includes(prefix)) return 'G / H / I'
  if (['J'].includes(prefix)) return 'J'
  if (['P'].includes(prefix)) return 'P'
  // Adicionar outros grupos conforme necessário
  return 'OUTROS' // Para estantes fora desses grupos
}

// Função para agrupar as shelves
function groupShelves(shelfDataArray: ShelfCodProps[]) {
  return shelfDataArray.reduce(
    (groups, shelf) => {
      const groupKey = getGroupByShelfCod(shelf.codPrat)

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(shelf)
      return groups
    },
    {} as Record<string, ShelfCodProps[]>,
  )
}

'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { ShelfCard } from '@/components/ui/Modules/Estoque/Inventario'
import { api } from '@/services'

export type ShelfData = {
  shelfCod: string
  Done: number
  Total: number
  progress: number
}

export default function ShelfInv() {
  const { data } = useQuery({
    queryKey: ['get-shelves'],
    queryFn: async () => {
      try {
        const response = await api.get('modules/stock/inventory/getShelves')

        console.log('get no shelfInv', response)

        return response.data
      } catch (error) {
        console.error(error)
      }
    },
  })

  console.log('data no shelfInv', data)

  const shelfDataArray: ShelfData[] = [
    { shelfCod: 'A01/01', Done: 82, Total: 87, progress: 94.25 },
    { shelfCod: 'A02/01', Done: 49, Total: 86, progress: 56.98 },
    { shelfCod: 'A03/01', Done: 71, Total: 80, progress: 88.75 },
    { shelfCod: 'A04/01', Done: 30, Total: 96, progress: 31.25 },
    { shelfCod: 'A05/01', Done: 97, Total: 99, progress: 97.98 },
    { shelfCod: 'A06/01', Done: 70, Total: 97, progress: 72.16 },
    { shelfCod: 'A07/01', Done: 1, Total: 93, progress: 1.08 },
    { shelfCod: 'A08/01', Done: 11, Total: 56, progress: 19.64 },
    { shelfCod: 'A09/01', Done: 11, Total: 48, progress: 22.92 },
    { shelfCod: 'A10/01', Done: 11, Total: 11, progress: 100.0 },
    { shelfCod: 'B01/01', Done: 58, Total: 84, progress: 69.05 },
    { shelfCod: 'B02/01', Done: 49, Total: 49, progress: 100.0 },
    { shelfCod: 'B03/01', Done: 88, Total: 96, progress: 91.67 },
    { shelfCod: 'B04/01', Done: 59, Total: 67, progress: 88.06 },
    { shelfCod: 'B05/01', Done: 92, Total: 92, progress: 100.0 },
    { shelfCod: 'B06/01', Done: 28, Total: 100, progress: 28.0 },
    { shelfCod: 'B07/01', Done: 12, Total: 42, progress: 28.57 },
    { shelfCod: 'B08/01', Done: 77, Total: 89, progress: 86.52 },
    { shelfCod: 'B09/01', Done: 100, Total: 100, progress: 100.0 },
    { shelfCod: 'B10/01', Done: 19, Total: 37, progress: 51.35 },
    { shelfCod: 'C01/01', Done: 81, Total: 96, progress: 84.38 },
    { shelfCod: 'C02/01', Done: 35, Total: 57, progress: 61.4 },
    { shelfCod: 'C03/01', Done: 17, Total: 90, progress: 18.89 },
    { shelfCod: 'C04/01', Done: 53, Total: 85, progress: 62.35 },
    { shelfCod: 'C05/01', Done: 58, Total: 86, progress: 67.44 },
    { shelfCod: 'C06/01', Done: 4, Total: 37, progress: 10.81 },
    { shelfCod: 'C07/01', Done: 86, Total: 88, progress: 97.73 },
    { shelfCod: 'C08/01', Done: 87, Total: 89, progress: 97.75 },
    { shelfCod: 'C09/01', Done: 55, Total: 81, progress: 67.9 },
    { shelfCod: 'C10/01', Done: 73, Total: 98, progress: 74.49 },
    { shelfCod: 'D01/01', Done: 84, Total: 88, progress: 95.45 },
    { shelfCod: 'D02/01', Done: 54, Total: 98, progress: 55.1 },
    { shelfCod: 'D03/01', Done: 77, Total: 93, progress: 82.8 },
    { shelfCod: 'D04/01', Done: 29, Total: 33, progress: 87.88 },
    { shelfCod: 'D05/01', Done: 62, Total: 66, progress: 93.94 },
    { shelfCod: 'D06/01', Done: 12, Total: 92, progress: 13.04 },
    { shelfCod: 'D07/01', Done: 82, Total: 90, progress: 91.11 },
    { shelfCod: 'D08/01', Done: 61, Total: 78, progress: 78.21 },
    { shelfCod: 'D09/01', Done: 10, Total: 42, progress: 23.81 },
    { shelfCod: 'D10/01', Done: 29, Total: 72, progress: 40.28 },
    { shelfCod: 'BATATA', Done: 29, Total: 72, progress: 40.28 },
    { shelfCod: 'MACARRAO', Done: 29, Total: 72, progress: 40.28 },
  ]

  const groupedShelves = groupShelves(shelfDataArray)

  console.log('renderizando')

  return (
    <Stack direction="column" w="100%" p={{ base: 0, md: 8 }}>
      <Text fontSize={50}>Prateleiras</Text>
      <Accordion allowMultiple overflow="auto">
        {Object.keys(groupedShelves).map((group) => (
          <AccordionItem key={group} transition="all 2s ease">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Grupo {group}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={0}>
              <Grid
                // w="100%"
                templateColumns={[
                  'repeat(2, 1fr)',
                  'repeat(3, 1fr)',
                  'repeat(4, 1fr)',
                  'repeat(6, 1fr)',
                  'repeat(7, 1fr)',
                  'repeat(8, 1fr)',
                ]}
                p={2}
                my={2}
                gap={4}
              >
                {groupedShelves[group].map((shelf) => (
                  <ShelfCard key={shelf.shelfCod} shelfData={shelf} />
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {/* <ShelfCard shelfData={shelfDataArray} /> */}
    </Stack>
  )
}

// Função para definir o grupo baseado no prefixo da shelf
function getGroupByShelfCod(shelfCod: string): string {
  const prefix = shelfCod.charAt(0).toUpperCase() // Pega o primeiro caractere
  if (['A', 'B', 'C'].includes(prefix)) return 'ABC'
  if (['D', 'E', 'F'].includes(prefix)) return 'DEF'
  if (['G', 'H', 'I'].includes(prefix)) return 'GHI'
  // Adicionar outros grupos conforme necessário
  return 'OUTROS' // Para estantes fora desses grupos
}

// Função para agrupar as shelves
function groupShelves(shelfDataArray: ShelfData[]) {
  return shelfDataArray.reduce(
    (groups, shelf) => {
      const groupKey = getGroupByShelfCod(shelf.shelfCod)

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(shelf)
      return groups
    },
    {} as Record<string, ShelfData[]>,
  )
}

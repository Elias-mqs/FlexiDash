'use client'

import { Flex, Grid } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BsClipboardPlus } from 'react-icons/bs'

import { ScreenCard } from '@/components/ui/Inventory'

export default function Estoque() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('routines')

  console.log(search)

  const cardRoute = {
    StartInventory: '/modules/inventario/iniciar',
  }

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
        <ScreenCard
          icon={BsClipboardPlus}
          title="Novo inventário"
          descCard="Iniciar um novo inventário"
          onClick={() => router.push(cardRoute.StartInventory)}
        />
        <ScreenCard icon={BsClipboardPlus} />
        <ScreenCard icon={BsClipboardPlus} />
        <ScreenCard icon={BsClipboardPlus} />
        <ScreenCard icon={BsClipboardPlus} />
        <ScreenCard icon={BsClipboardPlus} />
        <ScreenCard icon={BsClipboardPlus} />

        <Flex>Teste</Flex>
      </Grid>
    </Flex>
  )
}

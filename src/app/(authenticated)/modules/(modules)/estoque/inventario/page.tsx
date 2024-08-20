'use client'

import { Flex, Grid } from '@chakra-ui/react'
import { BsClipboardPlus } from 'react-icons/bs'

import { ScreenCard } from '@/components/ui'

export default function HomeInventory() {
  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
        <ScreenCard icon={BsClipboardPlus} title="Novo inventário" description="Iniciar um novo inventário" />
      </Grid>
    </Flex>
  )
}

'use client'

import { useEffect } from 'react'

import { Skeleton, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Isso só será executado no cliente
    router.push('/modules')
  }, [router])

  return (
    <Stack>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  )
}

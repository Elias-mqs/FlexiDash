import { Skeleton, Stack } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Stack justify="center" align="center">
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  )
}

'use client'

import { Flex, Icon, Text } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import { IconType } from 'react-icons/lib'

interface ScreenCardProps {
  icon: IconType
  title: string
  route: string
}

export function ScreenCardResource({ icon, title, route }: ScreenCardProps) {
  const router = useRouter()

  const pathname = usePathname()

  return (
    <Flex
      borderRadius={8}
      gap={1}
      _hover={{ bg: '#f0f0f0', cursor: 'pointer' }}
      onClick={() => router.push(`${pathname}/${route}`)}
      minW="195px"
    >
      <Flex bg="#f0f0f0" p={2} marginBottom="auto" borderRadius={12}>
        <Icon as={icon} color="blue.700" fontSize={{ base: 30, sm: 24 }} />
      </Flex>

      <Flex direction="column" p={2} gap={1}>
        <Text fontSize={18} fontWeight={600} color="blue.600">
          {title}
        </Text>
      </Flex>
    </Flex>
  )
}

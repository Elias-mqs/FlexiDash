'use client'

import { Flex, Icon, Text } from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'

export function ScreenCard({ icon, title, description }: { icon: IconType; title: string; description: string }) {
  return (
    <Flex maxH="86px" minW="182px" minH="65px" borderRadius={8} _hover={{ bg: '#f0f0f0', cursor: 'pointer' }} gap={2}>
      <Flex bg="#f0f0f0" p={2} marginBottom="auto" ml={1} mt={1} borderRadius={12}>
        <Icon as={icon} color="blue.700" fontSize={{ base: 30, sm: 24 }} />
      </Flex>

      <Flex direction="column" p={2} gap={1}>
        <Text fontWeight={600} color="blue.600">
          {title}
        </Text>
        <Text fontSize={14}>{description}</Text>
      </Flex>
    </Flex>
  )
}

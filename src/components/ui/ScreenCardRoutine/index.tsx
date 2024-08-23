'use client'

import { Flex, Icon, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { IconType } from 'react-icons/lib'

import { FormsCrypt } from '@/services'

interface ScreenCardProps {
  icon: IconType
  title: string
  accessData: {
    acsRoutineId: number
    routineId: number
    slug: string
  }
}

export function ScreenCardRoutine({ icon, title, accessData }: ScreenCardProps) {
  const router = useRouter()

  const pathname = usePathname()

  const accessResource = async () => {
    if (!accessData.acsRoutineId || !accessData.routineId) {
      // eslint-disable-next-line no-useless-return
      return
    }

    const { data } = FormsCrypt.dataCrypt({ acsRtnId: accessData.acsRoutineId, routineId: accessData.routineId })

    Cookies.set('acsRtnData', data)

    router.push(`${pathname}/${accessData.slug}`)
  }

  return (
    <Flex borderRadius={8} gap={1} _hover={{ bg: '#f0f0f0', cursor: 'pointer' }} onClick={accessResource}>
      <Flex bg="#f0f0f0" p={2} marginBottom="auto" borderRadius={12}>
        <Icon as={icon} color="blue.700" fontSize={{ base: 30, sm: 24 }} />
      </Flex>

      <Flex direction="column" p={2} gap={1}>
        {title ? (
          <Text fontSize={18} fontWeight={600} color="blue.600">
            {title}
          </Text>
        ) : (
          <Text>teste</Text>
        )}
      </Flex>
    </Flex>
  )
}

'use client'

import { Flex, Icon, Spinner, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import Image from 'next/image'
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

  if (!title) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <Flex borderRadius={8} gap={1} _hover={{ bg: '#f0f0f0', cursor: 'pointer' }} onClick={accessResource}>
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

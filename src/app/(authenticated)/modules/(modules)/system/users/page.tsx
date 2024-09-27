'use client'

import { Flex, Grid, Spinner, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { FaUserPlus, FaUserEdit } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

import { ScreenCardResource } from '@/components/ui'
import { useAccessUser } from '@/context/SystemLists/AccessUserContext'

const resourceDetails: Record<string, { icon: IconType; params: string }> = {
  Cadastrar: { icon: FaUserPlus, params: '' }, // O params é caso tenha
  'Atualizar dados': { icon: FaUserEdit, params: '/?page=1&per_page=10' },
}

export default function UserManagement() {
  const { useListResource } = useAccessUser()
  const resourceList = useListResource()

  if (!resourceList || resourceList?.length === 0) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" gap={2}>
        <Image alt="loading" src="/img/undraw_Loading.png" width={401} height={430} priority />
        <Text fontWeight="bold">Carregando...</Text>
        <Spinner mt={2} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <Flex w="100%" direction="column" p={4} overflow="auto">
      {/* <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}> */}
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={8}
      >
        {resourceList.map((resource) => {
          const resourceName = resource?.sis_recurso_rotina?.nome
          const { icon, params } = resourceDetails[resourceName] || {}
          return (
            <ScreenCardResource
              key={resource.id}
              icon={icon}
              title={resourceName}
              route={resource.sis_recurso_rotina?.slug}
              params={params}
            />
          )
        })}
      </Grid>
    </Flex>
  )
}

// 'use client'

// import { Button, Flex } from '@chakra-ui/react'
// import { useRouter } from 'next/navigation'

// export default function System() {
//   const router = useRouter()

//   function redirect() {
//     router.push('/modules/system/users/register')
//   }

//   return (
//     <Flex direction="column" gap={8}>
//       Página system
//       <Button onClick={redirect}>Ir para Register</Button>
//     </Flex>
//   )
// }

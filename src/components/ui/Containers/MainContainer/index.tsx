'use client'

import { Flex } from '@chakra-ui/react'

import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/Sidebar'
import { useLayoutComponent } from '@/context/LayoutComponents/LayoutCompContext'

export function MainContainer({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useLayoutComponent()

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} w="100%" h="100%">
      <Sidebar />
      <Flex
        w="100%"
        direction="column"
        ml={{ base: 0, sm: isExpanded ? '200px' : '70px' }}
        mt={{ base: isExpanded ? '220px' : '0px', sm: 0 }}
        transition="margin-left .5s ease, margin-top .5s ease"
      >
        <Header />
        {/* o H do flex abaixo é 100%, eu alterei pra 80vh para compensar a saida provisória do Sidebar */}
        <Flex
          h={{ base: 'calc(100vh - 85px)', sm: 'calc(100vh - 131px)' }}
          mt={{ base: 0, sm: 4 }}
          ml={{ base: 0, sm: 4 }}
          bg="#fff"
          borderRadius="1rem"
          p={4}
          boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
        >
          {children}
        </Flex>
        <Footer />
      </Flex>
    </Flex>
  )
}

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
  // IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
// import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoIosArrowForward, IoMdSettings } from 'react-icons/io'

import { useLayoutComponent } from '@/context/LayoutComponents/LayoutCompContext'
import { useUserData } from '@/context/User/UserDataContext'

export function Header() {
  const { isExpanded } = useLayoutComponent()
  const dataUser = useUserData()

  console.log('dataUser no Header: ', dataUser)

  const ptHeader = isExpanded ? 'pt-1' : 'pt-3'

  return (
    // <Flex pl={4} w="100%" h="64px">
    //   Header
    // </Flex>

    <Box
      as="header"
      className={`flex h-16 w-full justify-between pl-4 ${ptHeader} transition-all duration-500 ease-in-out`}
    >
      <Flex direction="column" justify="start">
        <Breadcrumb ml={{ base: 0, md: 8 }} spacing="8px" separator={<IoIosArrowForward color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">About</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {/* Deixei comentado porque acho que não vai precisar devido a já ter a sidebar */}
        {/* <Flex ml={{ base: -2, md: 4 }}>
          <IconButton
            mt={{ base: 0, md: 2 }}
            borderRadius={12}
            w="24px"
            h="24px"
            aria-label="Back Button"
            bg="blue.100"
            color="#fff"
            _hover={{ color: 'blue.100', bg: 'transparent', border: '2px solid #bee3f8' }}
            icon={<FaArrowLeftLong size="20px" />}
          />
        </Flex> */}
      </Flex>
      <Menu>
        <MenuButton
          as={IconButton}
          mr={{ base: 12, md: 2 }}
          mt={{ base: -0.5, md: 0 }}
          boxSize="32px"
          borderRadius="full"
          icon={<IoMdSettings size={24} className="text-zinc-600" />}
        />
        <MenuList w="150px" mr={4}>
          <MenuItem>Teste</MenuItem>
          <MenuItem>Teste 2</MenuItem>
          <MenuItem>Teste 3</MenuItem>
          <MenuItem>Teste 4</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}

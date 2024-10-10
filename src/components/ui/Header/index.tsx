import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
// import { FaArrowLeftLong } from 'react-icons/fa6'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoIosArrowForward, IoMdSettings } from 'react-icons/io'

import { useLayoutComponent } from '@/context/LayoutComponents/LayoutCompContext'

export function Header() {
  const { toggleSideBar } = useLayoutComponent()

  return (
    <Flex
      as="header"
      h="4rem"
      w="100%"
      minH="55px"
      direction={{ base: 'row-reverse', md: 'row' }}
      transition="all .5s ease-in-out"
      pt={{ base: 2, md: 4 }}
      pl={{ base: 0, md: 4 }}
    >
      <Button
        w="30px"
        h="30px"
        minW="30px"
        p={0}
        colorScheme="blue"
        borderRadius="full"
        onClick={toggleSideBar}
        transition="top 0.5s ease, right 0.5s ease"
      >
        <Icon as={GiHamburgerMenu} fontSize={14} />
      </Button>

      <Flex w="100%" justify="space-between">
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
            mr={2}
            mt={{ base: -0.5, md: 0 }}
            boxSize="32px"
            borderRadius="full"
            icon={<IoMdSettings size={24} color="#718096" className="text-zinc-600" />}
          />
          <MenuList w="150px" mr={4}>
            <MenuItem>Teste</MenuItem>
            <MenuItem>Teste 2</MenuItem>
            <MenuItem>Teste 3</MenuItem>
            <MenuItem>Teste 4</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

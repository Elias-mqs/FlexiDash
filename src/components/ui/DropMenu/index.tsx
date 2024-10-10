import { Dispatch, SetStateAction } from 'react'

import { Flex, Button, Icon, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { BsBookshelf } from 'react-icons/bs'
import { FaClipboardList, FaUsers, FaCogs, FaUserPlus, FaUserEdit } from 'react-icons/fa'
import { FaBoxesPacking } from 'react-icons/fa6'
import { IconType } from 'react-icons/lib'
import { MdSettings, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md'

import { MenuAccessListProps } from '@/app/api/header/menu-access/route'

interface DropMenuProps {
  splitPathname: string[]
  menuAccessList: MenuAccessListProps
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
  isExpanded: boolean
}

export function DropMenu({ splitPathname, menuAccessList, openMenu, setOpenMenu, isExpanded }: DropMenuProps) {
  const router = useRouter()

  const identifyPathname = menuAccessList.sis_acess_modulo.filter(
    (menuList) => menuList.sis_modulos.slug === splitPathname[2],
  )

  /// Icones para os módulos
  const modulesIcons: Record<string, IconType> = {
    system: MdSettings,
    estoque: FaBoxesPacking,
  }

  /// Icones para as rotinas
  const routineIcons: Record<string, IconType> = {
    inventario: FaClipboardList,
    users: FaUsers,
  }

  const resourceIcons: Record<string, IconType> = {
    'status-inventario': FaCogs,
    shelf: BsBookshelf,
    register: FaUserPlus,
    'update-user': FaUserEdit,
  }

  /// /////// Abaixo estão dividios os drop menus em módulos, rotinas e recursos

  /// Modules drop menu
  if (splitPathname.length === 3) {
    return (
      <Flex as="li" align="center" direction="column" mt={2}>
        {identifyPathname.map((listMod) => (
          <Flex key={listMod.sis_modulos.id} w="100%" direction="column">
            <Button
              px={isExpanded ? 6 : 0}
              w="auto"
              minH="40px"
              colorScheme="blue"
              variant={splitPathname[2] === listMod.sis_modulos.slug ? 'outline' : 'ghost'}
              borderRadius="1rem"
              transition="all .3s ease"
            >
              <Icon
                mr={{ base: 2, md: isExpanded ? 2 : 0 }}
                fontSize={22}
                as={modulesIcons[listMod.sis_modulos.slug]}
              />
              <Text as="span" display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}>
                {listMod.sis_modulos.nome}
              </Text>
            </Button>
          </Flex>
        ))}
      </Flex>
    )
  }

  /// Routines drop menu
  if (splitPathname.length === 4) {
    const navigationRoute = (slug: string) => {
      router.push(`/${splitPathname[1]}/${splitPathname[2]}/${slug}`)
    }

    return (
      <Flex as="li" align="center" direction="column" mt={2}>
        {identifyPathname.map((listMod) => (
          <Flex key={listMod.sis_modulos.id} w="100%" direction="column">
            <Button
              px={isExpanded ? 6 : 0}
              w="auto"
              minH="40px"
              colorScheme="blue"
              variant={splitPathname[2] === listMod.sis_modulos.slug ? 'outline' : 'ghost'}
              borderRadius="1rem"
              transition="all .3s ease"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <Icon
                mr={{ base: 2, md: isExpanded ? 2 : 0 }}
                fontSize={22}
                as={modulesIcons[listMod.sis_modulos.slug]}
              />

              <Text as="span" display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}>
                {listMod.sis_modulos.nome}
              </Text>

              <Icon
                display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}
                ml={2}
                fontSize={22}
                as={openMenu ? MdOutlineKeyboardArrowUp : MdOutlineKeyboardArrowDown}
              />
            </Button>

            <Flex
              direction="column"
              h={openMenu ? `${listMod.sis_modulos.sis_rotinas.length * 56}px` : '0px'}
              overflow="hidden"
              transition="all .3s ease"
            >
              {listMod.sis_modulos.sis_rotinas.map((listRout) => (
                <Button
                  key={listRout.id}
                  mt={4}
                  py={2}
                  variant="ghost"
                  colorScheme="blue"
                  overflow="hidden"
                  onClick={() => navigationRoute(listRout.slug)}
                >
                  <Icon mr={{ base: 2, md: isExpanded ? 2 : 0 }} fontSize={22} as={routineIcons[listRout.slug]} />

                  <Text as="span" display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}>
                    {listRout.nome}
                  </Text>
                </Button>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    )
  }

  /// Resources drop menu
  if (splitPathname.length === 5) {
    const navigationRoute = (slug: string) => {
      router.push(`/${splitPathname[1]}/${splitPathname[2]}/${splitPathname[3]}/${slug}`)
    }

    return (
      <Flex as="li" align="center" direction="column" mt={2}>
        {identifyPathname.map((listMod) =>
          listMod.sis_modulos.sis_rotinas.map((listRout) => (
            <Flex key={listRout.id} w="100%" direction="column">
              <Button
                px={isExpanded ? 6 : 0}
                w="auto"
                minH="40px"
                colorScheme={splitPathname[3] === listRout.slug ? 'cyan' : 'blue'}
                variant="ghost"
                borderRadius="1rem"
                transition="all .3s ease"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <Icon mr={{ base: 2, md: isExpanded ? 2 : 0 }} fontSize={22} as={routineIcons[listRout.slug]} />

                <Text as="span" display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}>
                  {listRout.nome}
                </Text>

                <Icon
                  display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}
                  ml={2}
                  fontSize={22}
                  as={openMenu ? MdOutlineKeyboardArrowUp : MdOutlineKeyboardArrowDown}
                />
              </Button>

              <Flex
                direction="column"
                h={openMenu ? `${listRout.sis_recurso_rotina.length * 56}px` : '0px'}
                overflow="hidden"
                transition="all .3s ease"
              >
                {listRout.sis_recurso_rotina.map((listRes) => {
                  return (
                    <Button
                      key={listRes.id}
                      mt={4}
                      py={2}
                      borderRadius="1rem"
                      variant={splitPathname[4] === listRes.slug ? 'outline' : 'ghost'}
                      colorScheme="blue"
                      overflow="hidden"
                      onClick={() => navigationRoute(listRes.slug)}
                    >
                      <Icon mr={{ base: 2, md: isExpanded ? 2 : 0 }} fontSize={22} as={resourceIcons[listRes.slug]} />

                      <Text
                        as="span"
                        display={{ base: 'block', md: isExpanded ? 'block' : 'none' }}
                        mr={{ base: 0, md: 'auto' }}
                      >
                        {listRes.nome}
                      </Text>
                    </Button>
                  )
                  // Retorna null se for o ID 3 e o status for false
                })}
              </Flex>
            </Flex>
          )),
        )}
      </Flex>
    )
  }
}

import { ChangeEvent } from 'react'

import { Flex, IconButton, Select, Text } from '@chakra-ui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FiChevronsLeft, FiChevronLeft, FiChevronsRight, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  pages: number
  items: number
  page: number
  perPage: string
  viewing: number // (list.length)
}

export function Pagination({ pages, items, page, perPage, viewing }: PaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const params = new URLSearchParams(searchParams.toString())

  const firstPage = () => {
    params.set('page', '1')

    return router.push(pathname + '?' + params.toString())
  }

  const previousPage = () => {
    if (page - 1 <= 0) {
      return
    }
    params.set('page', String(page - 1))

    return router.push(pathname + '?' + params.toString())
  }

  const nextPage = () => {
    if (page + 1 > pages) {
      return
    }
    params.set('page', String(page + 1))

    return router.push(pathname + '?' + params.toString())
  }

  const lastPage = () => {
    params.set('page', String(pages))

    return router.push(pathname + '?' + params.toString())
  }

  const handleRowsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    params.set('per_page', String(e.target.value))

    router.push(pathname + '?' + params.toString())
  }

  return (
    <Flex
      as="nav"
      aria-label="Pagination"
      px="16px"
      justify="space-between"
      align="center"
      direction={{ base: 'column-reverse', md: 'row' }}
      gap={4}
    >
      <div className="flex w-auto justify-center gap-2">
        <label className="my-auto text-sm font-medium text-gray-600">Linhas por página:</label>

        <Select w="72px" value={perPage} onChange={handleRowsChange} className="h-9 text-base">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </Select>
      </div>

      <span className="hidden md:block">
        visualizando {viewing} de {items}
      </span>

      <Flex align="center" direction={{ base: 'column-reverse', md: 'row' }} gap={2}>
        <Text fontSize={14}>
          Página {page} de {pages}
        </Text>
        <Flex gap={2}>
          <IconButton
            h="32px"
            bg="blue.50"
            _hover={{ bg: '#e1f3fc' }}
            _active={{ bg: '#595959' }}
            aria-label="Primeira página"
            icon={<FiChevronsLeft color="8a8888" size={20} />}
            onClick={firstPage}
            isDisabled={page - 1 <= 0}
          />
          <IconButton
            h="32px"
            bg="blue.50"
            _hover={{ bg: '#e1f3fc' }}
            _active={{ bg: '#595959' }}
            aria-label="Página anterior"
            icon={<FiChevronLeft color="8a8888" size={20} />}
            onClick={previousPage}
            isDisabled={page - 1 <= 0}
          />
          <IconButton
            h="32px"
            bg="blue.50"
            _hover={{ bg: '#e1f3fc' }}
            _active={{ bg: '#595959' }}
            aria-label="Próxima página"
            icon={<FiChevronRight color="8a8888" size={20} />}
            onClick={nextPage}
            isDisabled={page + 1 > pages}
          />
          <IconButton
            h="32px"
            bg="blue.50"
            _hover={{ bg: '#e1f3fc' }}
            _active={{ bg: '#595959' }}
            aria-label="Última página"
            icon={<FiChevronsRight color="8a8888" size={20} />}
            onClick={lastPage}
            isDisabled={page + 1 > pages}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

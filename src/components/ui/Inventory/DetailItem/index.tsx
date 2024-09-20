import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  ModalCloseButton,
  Input,
  Button,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { FaRegEdit, FaCheck } from 'react-icons/fa'
import { RiCloseLine } from 'react-icons/ri'
import { z } from 'zod'

import { ShelfDetailsProps } from '@/app/(authenticated)/modules/(modules)/estoque/inventario/shelf/shelfDetails/[shelfDetails]/page'
import { api, FormsCrypt } from '@/services'

interface DetailItemProps {
  items: ShelfDetailsProps
  isOpen: boolean
  onClose: () => void
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      | false
      | {
          shelfDetails: ShelfDetailsProps[]
        },
      Error
    >
  >
}

const updateShelfSchema = z.object({
  qtdCount: z.string(),
})

export const DetailItem = ({ items, isOpen, onClose, refetch }: DetailItemProps) => {
  const toast = useToast()

  const { control, handleSubmit, resetField } = useForm<{ qtdCount: number | string }>({
    resolver: zodResolver(updateShelfSchema),
    defaultValues: { qtdCount: items.qtdB7 || items.qtdB7 === 0 ? items.qtdB7 : '' },
  })

  /// /////////////////////////////////////////////////////////////////////////////////////////////////
  /// /////////////////// Atualiza o campo quantidade no modal de alteração do item ///////////////////
  /// /////////////////////////////////////////////////////////////////////////////////////////////////
  const handleUpdateShelf = async (data: { qtdCount: number | string }) => {
    if (!data || !data.qtdCount) {
      toast({
        title: 'Atenção',
        description: 'Informe um valor válido',
        status: 'info',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    const qtdCount = Number(data.qtdCount)

    /// Se o item ja foi lançado ele atualiza
    const formCrypt =
      !items.qtdB7 && items.qtdB7 !== 0
        ? FormsCrypt.dataCrypt({ qtdCount, codProd: items.codProd, newRegister: true })
        : FormsCrypt.dataCrypt({ qtdCount, codProd: items.codProd, newRegister: false })

    try {
      await api.post('modules/stock/inventory/updateItemShelf', formCrypt)

      refetch()
      resetField('qtdCount')
      onClose()

      toast({
        title: 'Produto atualizado',
        description: 'Verifique o status',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro interno')
      toast({
        title: 'Erro ao atualizar - contate a TI',
        description: '',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleClose = () => {
    resetField('qtdCount')
    refetch()
    onClose()
  }

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(handleUpdateShelf)} mx={2}>
        <ModalHeader borderBottom="1px solid #e5e5e5" mx={2} px={4}>
          <Flex direction="column" gap={2}>
            <Flex
              w="40px"
              h="40px"
              pl={1}
              align="center"
              justify="center"
              border="1px solid #e0e0e0"
              borderRadius={10}
              boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
            >
              <FaRegEdit size="22px" color="gray" />
            </Flex>
            <Text>Alterar item</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <Flex direction="column">
          <Flex direction="column" p={4} pb={6} borderBottom="1px solid #e5e5e5" bg="#fff" gap={2}>
            <Flex direction="column" pb={2}>
              <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                Descrição:
              </Text>
              <Input
                placeholder={items.descProd}
                maxLength={9}
                fontWeight={500}
                _placeholder={{ color: 'gray.600' }}
                boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
                readOnly
              />
            </Flex>

            <Flex align="center" justify="space-between">
              <Flex direction="column">
                <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                  Código:
                </Text>
                <Input
                  placeholder={items.codProd}
                  readOnly
                  maxLength={9}
                  fontWeight={500}
                  _placeholder={{ color: 'gray.600' }}
                  boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
                />
              </Flex>

              <Flex>
                <Controller
                  name="qtdCount"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Flex direction="column">
                      <Text pb={0.5} pl={2} fontSize={14} fontWeight={600} color="#1E3A8A">
                        Quantidade:
                      </Text>
                      <Input
                        value={value}
                        onChange={onChange}
                        type="number"
                        maxW="120px"
                        placeholder={items.qtdB7 || items.qtdB7 === 0 ? `${items.qtdB7}` : 'Ex: 10'}
                        maxLength={9}
                        fontWeight={500}
                        color="gray.700"
                        _placeholder={{ color: items.qtdB7 || items.qtdB7 === 0 ? 'gray.400' : 'gray.300' }}
                        boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.05)"
                      />
                    </Flex>
                  )}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex w="100%" gap={4} p={4}>
          <Button
            w="100%"
            boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.1)"
            size="sm"
            border="1px solid #e0e0e0"
            bg="transparent"
            gap={1}
            onClick={handleClose}
            _hover={{ transform: `translateY(-2px)` }}
            _active={{ transform: 'translateY(2px)' }}
            transition="all .3s ease"
          >
            <RiCloseLine fontSize={22} />
            Cancelar
          </Button>

          <Button
            w="100%"
            type="submit"
            boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
            bg="blue.500"
            size="sm"
            colorScheme="blue"
            gap={2}
            _hover={{ transform: `translateY(-2px)` }}
            _active={{ transform: 'translateY(2px)' }}
            transition="all .3s ease"
          >
            <FaCheck />
            Atualizar
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

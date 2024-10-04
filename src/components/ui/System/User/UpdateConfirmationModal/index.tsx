import { Modal, ModalOverlay, ModalContent, ModalHeader, Flex, ModalCloseButton, Button, Text } from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'
import { RiErrorWarningLine, RiCloseLine } from 'react-icons/ri'

export function UpdateConfirmationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx={{ base: 6, sm: 4 }} mt={24} bgGradient="linear(to-b, blue.100, white)">
        <ModalHeader borderBottom="1px solid #d5d5d5" mx={4} pb={2}>
          <Flex ml={-6} p={2} bg="blue.100" borderRadius="full" w="62px">
            <Flex p={2} bg="blue.200" borderRadius="full">
              <RiErrorWarningLine color="blue" fontSize={30} />
            </Flex>
          </Flex>
          <Text ml={-4} mt={2} fontSize={22} fontWeight={700}>
            Confirmar atualização
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <Flex p={4} direction="column">
          <Text fontWeight={600} fontSize={18} ml={2}>
            Tem certeza que deseja atualizar as informações do usuário?
          </Text>
          <Text fontWeight={500} ml={2}>
            (Você não poderá recuperar esses dados)
          </Text>
          <Flex w="100%" justify="end" mt={4} p={4} pb={2} gap={4}>
            <Button
              type="submit"
              form="userUpdateForm"
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="green.500"
              size="sm"
              colorScheme="green"
              gap={2}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <FaCheck />
              Confirmar
            </Button>
            <Button
              boxShadow="0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
              bg="red.500"
              size="sm"
              colorScheme="red"
              gap={1}
              onClick={onClose}
              _hover={{ transform: `translateY(-2px)` }}
              _active={{ transform: 'translateY(2px)' }}
              transition="all .3s ease"
            >
              <RiCloseLine fontSize={22} />
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

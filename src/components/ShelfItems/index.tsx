import {
    Button, Divider, Flex, Grid, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
} from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa";



export function ShelfItems({ dataItem }: any) {

    console.log('itens')
    console.log(dataItem)

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (

        <Grid templateColumns='2fr 3fr 1fr 1fr 1fr' mx={2} minW='container.lg' gap={4} px={4} py={2} borderTop='1px solid #f0f0f0' borderBottom='1px solid #f0f0f0'>

            <Flex overflow='hidden' minH='30px' maxH='50px' align='center'>
                <Input variant='unstyled' value={dataItem.codigo} onChange={e=> e.target.value} color='gray.500' readOnly />
            </Flex>

            <Flex overflow='hidden' minH='30px' maxH='50px' >
                <Input variant='unstyled' value={dataItem.desc} onChange={e=> e.target.value} color='gray.500' readOnly />
            </Flex>

            <Flex overflow='hidden' minH='30px' maxH='50px' align='center' px={4} py={0}>
                <Input type='number' variant='unstyled' value={dataItem.qtd} onChange={e=> e.target.value} color='gray.500' />
            </Flex>

            <Flex overflow='hidden' minH='30px' maxH='50px' align='center' gap={2}>
                <Icon as={FaCheckCircle} boxSize={6} color='green' />
                <Text wordBreak='break-word' color='gray.500'>{dataItem.status}</Text>
            </Flex>

            <Flex align='center' justify='center'>
                <Text color='blue.600' fontSize={14} fontWeight={600} _hover={{ fontSize: 15, cursor: 'pointer' }} onClick={onOpen} >Alterar</Text>
            </Flex>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx={2} >
                    <ModalHeader>Alterar item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Flex direction='column' pb={2}>
                            <Input variant='unstyled' value='UNID. GUIA DE SEPARACAO SF-7750-SEM FABRIACAO SHAR' color='gray.500' />
                        </Flex>
                        <Divider />

                        <Flex mt={4} gap={2}>
                            <Text fontWeight={600} fontSize={14}>Código:</Text>
                            <Input variant='unstyled' color='gray.500' value='123asd123asd' />
                        </Flex>

                        <Flex mt={2} align='center' gap={2}>
                            <Text fontWeight={600} fontSize={14}>Quantidade:</Text>
                            <Input type='number' maxW='100px' placeholder='123' />
                        </Flex>

                    </ModalBody>

                    <ModalFooter>
                        <Button borderRadius={20} colorScheme='green' mr={3}>
                            Salvar
                        </Button>
                        <Button borderRadius={20} variant='ghost' onClick={onClose} _hover={{ color: 'red.600' }}>cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </Grid>

    )
}




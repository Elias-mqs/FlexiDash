import { Flex, Text } from "@chakra-ui/react";

export function Footer(){
    return(
        <Flex w='100%' h='50px' justify='center' align='center'>
            <Text fontWeight={600} fontSize={14}>© 2024 H2L. Todos os direitos reservados.</Text>
        </Flex>
    )
}
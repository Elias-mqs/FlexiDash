'use client'

import { Flex, Icon, Text } from "@chakra-ui/react";


export function ScreenCard({ icon, title, descCard, onClick }: any) {
    return (
        <Flex maxH='86px' minW='182px' minH='65px' borderRadius={8} _hover={{ bg:'#f0f0f0', cursor:'pointer' }} gap={2} onClick={onClick}>

            <Flex bg='#f0f0f0' p={2} marginBottom='auto' ml={1} mt={1} borderRadius={12}>
                <Icon color='blue.700' fontSize={{base:30, sm:24}} as={icon} />
            </Flex>

            <Flex direction='column' p={2} gap={1}>
                <Text fontWeight={600} color='blue.600'>{title}</Text>
                <Text fontSize={14}>{descCard}</Text>
            </Flex>
            {/* <Flex direction='column' p={2} gap={1}>
                <Text fontWeight={600} color='blue.600'>Novo inventário</Text>
                <Text fontSize={14}>Iniciar um novo inventário</Text>
            </Flex> */}

        </Flex>
    )
}
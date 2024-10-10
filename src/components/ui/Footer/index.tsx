import { Flex, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Flex as="footer" w="100%" pt={4} pb={2} justify="center" align="center">
      <Text fontWeight={600} fontSize={14}>
        © 2024 H2L. Todos os direitos reservados.
      </Text>
    </Flex>
  )
}

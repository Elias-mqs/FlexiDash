'use client'

import { useSearchParams } from "next/navigation";
import {  Flex, Grid, Input, Text } from "@chakra-ui/react";
import { ShelfItems } from "@/components";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod';

interface TesteProps{
    codigo: string,
    desc: string,
    qtd:string,
    status:string
}

export default function ShelfDetails() {

    const searchParams = useSearchParams();

    const detailsParams = {
        descPra: searchParams.get('descpra'),
        aramz: searchParams.get('armaz')
    }

    console.log(detailsParams)

    const teste: TesteProps = {
        codigo: '112312312',
        desc: 'UNID. GUIA DE SEPARACAO SF-7750-SEM FABRIACAO SHARas asd asdasd',
        qtd: '123123122',
        status: 'Conferido'
    }

    return (
        <Flex w='100%' direction='column'>

            <Flex w='100%' justify={{ base: 'center', sm: 'end' }} p={4}>
                <Input w='300px' size='md' focusBorderColor='blue.300' placeholder='Pesquisar' color='gray.500' />
            </Flex>

            <Flex direction='column' overflowX='auto'>

                <Grid templateColumns='2fr 3fr 1fr 1fr 1fr' gap={4} px={4} py={2} mx={2} minW='container.lg'>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>CÓDIGO</Text>
                    </Flex>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>DESCRIÇÃO</Text>
                    </Flex>

                    <Flex px={4}>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>QTD</Text>
                    </Flex>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>STATUS</Text>
                    </Flex>

                </Grid>

                <ShelfItems dataItem={teste} />

            </Flex>


        </Flex>
    )
}
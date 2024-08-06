'use client'

import { useSearchParams } from "next/navigation";
import { Flex, Grid, Input, Text } from "@chakra-ui/react";
import { ShelfItems } from "@/components";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod';
import { useEffect, useState } from "react";
import { getItems } from "@/utils/actions/get-data";

interface ItemsProps {
    codigo: string,
    desc: string,
    quant: string,
}

export default function ShelfDetails() {

    const searchParams = useSearchParams();
    const [items, setItems] = useState<ItemsProps[]>([])

    const detailsParams = {
        descPra: searchParams.get('descpra'),
        armaz: searchParams.get('armaz'),
        document: searchParams.get('doc')
    }

    useEffect(() => {
        async function getData() {
            const data = await getItems(detailsParams);
            // Apenas atualize o estado se os novos dados forem diferentes
            if (JSON.stringify(data) !== JSON.stringify(items)) {
                setItems(data.itens);
            }
        }
        getData();
    }, [])

    console.log(items)


    return (
        <Flex w='100%' direction='column'>

            <Flex w='100%' justify={{ base: 'center', sm: 'end' }} p={4}>

                <Input w='300px' size='md' focusBorderColor='blue.300' placeholder='Pesquisar' color='gray.500' />
            </Flex>

            <Flex direction='column' overflowX='auto'>

                <Grid templateColumns='2fr 4fr 1fr 1fr 1fr' gap={4} px={4} py={4} mx={2} minW='container.lg'>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>CÓDIGO</Text>
                    </Flex>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>DESCRIÇÃO</Text>
                    </Flex>

                    <Flex px={8}>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>QTD</Text>
                    </Flex>

                    <Flex>
                        <Text fontWeight={600} fontSize={14} color='#829abf'>STATUS</Text>
                    </Flex>

                </Grid>

                {items.map((data, index) => (
                    <ShelfItems key={index} itens={data} />
                ))}

            </Flex>


        </Flex>
    )
}
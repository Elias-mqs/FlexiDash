'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Flex, Grid, Input, Select, Text, useMediaQuery } from "@chakra-ui/react";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod';
import { Armazens } from "./armazens";

interface FormProps {
    document: string,
    armaz: string
}

const schema = z.object({
    document: z.coerce.string().max(9),
    armaz: z.coerce.string().max(2)
})


export default function CreateInventory() {


    const router = useRouter();


    const { handleSubmit, control, resetField } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { document: '', descPra: '', armaz: '' }
    })
    

    const handleForm = (data: FormProps): void => {
        resetField('document');
        resetField('armaz');

        router.push(`/inventario/shelf/details?armaz=${data.armaz}&doc=${data.document}`)

    }

    console.log('renderizando page create')

    return (
        <Flex w='100%' overflow='auto' direction='column' align='center' >

            <Grid as='form' onSubmit={handleSubmit(handleForm)} w={'100%'} maxW='container.md' templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', sm: 'repeat(2, 1fr)' }}
             gap={{ base: 1, md: 4 }}>


                <Controller
                    name='document'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Flex w='100%' p={2} direction='column'>
                            <Text fontWeight={600} fontSize={14} pb={1} pl={2} color='gray.500'>Código inventário:</Text>
                            <Input value={value} onChange={(e) => onChange(e.target.value.trim())} size='md' focusBorderColor='blue.300' placeholder='Documento' required />
                        </Flex>
                    )}
                />


                <Controller
                    name='armaz'
                    control={control}
                    render={({ field }) => (
                        <Flex w='100%' p={2} direction='column'>
                            <Text fontWeight={600} fontSize={14} pb={1} pl={2} color='gray.500'>Armazém:</Text>
                            <Armazens field={field} />
                        </Flex>
                    )}
                />


                <Flex w='100%' p={2} align='end' justify='center'>
                    <Button w='100%' type='submit' colorScheme='blue' bg='blue.300' borderRadius={16} >
                        Iniciar inventário
                    </Button>
                </Flex>


            </Grid>


            <Flex align='center' justify='center' direction='column' mt={6}>
                <Image src='/img/logistic.png' alt='Ilustração de campo de busca' width={700} height={410} priority />
                <Text fontFamily='cursive' fontSize={28} fontWeight={600} color='#7d7d7d' textAlign='center'>Inicie um novo inventário</Text>
            </Flex>

        </Flex >
    )
}
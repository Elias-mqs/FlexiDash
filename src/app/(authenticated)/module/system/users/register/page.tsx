'use client'

import { Button, Flex, Input } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form"



interface FormProps {
    name: string
    email: string
    username: string
    pass: string
}

export default function UserRegister() {

    const { handleSubmit, control } = useForm({
        defaultValues: { name: '', email: '', username:'', pass: '' }
    })

    const handleRegister = async (data: FormProps) => {
        console.log(data)
    }

    return (
        <Flex w='100%' direction='column' align='center'>

            <Flex as='form' onSubmit={handleSubmit(handleRegister)} direction='column' gap={8} mt={8}>

                <Controller
                    name='name'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Flex><Input value={value} onChange={onChange} placeholder='nome' /></Flex>
                    )}
                />

                <Controller
                    name='email'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Flex><Input value={value} onChange={onChange} placeholder='email' /></Flex>
                    )}
                />

                <Controller
                    name='username'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Flex><Input value={value} onChange={onChange} placeholder='usuario' /></Flex>
                    )}
                />

                <Controller
                    name='pass'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Flex><Input type='password' value={value} onChange={onChange} placeholder='senha' /></Flex>
                    )}
                />

                <Button type='submit' colorScheme='blue' >Cadastrar</Button>

            </Flex>
        </Flex>
    )
}
// Criei esse arquivo para realizar validações das variaveis de ambiente, porém sem sucesso

import { z } from 'zod';

console.log('rodando env ts')

const envSchema = z.object({
    ENDPOINT_ESTOQUE: z.string(),
    NEXT_PUBLIC_ENDPOINT_ESTOQUE: z.string()
})

console.log('passou pelo schema')

console.log(process.env)

if(!process.env){
    console.log('Não reconheceu: ', process.env)
}

export const envs = envSchema.parse(process.env)






'use server'

import { z } from 'zod';

const envSchema = z.object({
    ENDPOINT_ESTOQUE: z.string().url(),
    NEXT_PUBLIC_ENDPOINT_ESTOQUE: z.string().url(),
})

console.log(process.env.NEXT_PUBLIC_ENDPOINT_ESTOQUE)
console.log(process.env.ENDPOINT_ESTOQUE)

export const env = envSchema.parse(process.env)






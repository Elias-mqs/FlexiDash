import { FormsCrypt } from "@/services";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    const data  = await request.json()
    console.log(data)
    const teste = FormsCrypt.verifyData(data)
    console.log(teste)

    return NextResponse.json({ message: 'tudo certo' }, { status: 201 })
}
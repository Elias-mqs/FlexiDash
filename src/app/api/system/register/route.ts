import { FormsCrypt, PassCrypt } from "@/services";
import { NextResponse } from "next/server";
import { findUser } from "@/utils/database/repositories/sysUsers";


interface FormProps {
    name: string
    email: string
    username: string
    pass: string
}

export async function POST(request: Request) {

    const formData = await request.json()
    const userForm: FormProps = FormsCrypt.verifyData(formData)

    

}
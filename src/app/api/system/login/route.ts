import { FormsCrypt, PassCrypt } from "@/services";
import { NextResponse } from "next/server";
import { findUser } from "@/utils/database/repositories/sysUsers";



export async function POST(request: Request) {

    const formData = await request.json()
    const { username, pass }: { username: string, pass: string } = FormsCrypt.verifyData(formData)

    if (!username || !pass) {
        NextResponse.json({ message: 'Verifique os campos e tente novamente' }, { status: 400 });
    }

    console.log('username enviado: ', username)
    console.log('pass enviado: ', pass)

    const passwordHash = await PassCrypt.hashPassword(pass);

    console.log('Hash da senha: ', passwordHash)

    const userForm = formMap({ username, pass: passwordHash });

    console.log('form mapeado: ', userForm)

    try {
        const userDb = await findUser({ usr_username: userForm.usr_username })
        const dataUser = await userDb[0];
        console.log('dados buscados no banco: ', dataUser)
        console.log('pass do banco:', dataUser.usr_pass)

        const verifyPass = await PassCrypt.verifyPassword(userForm.usr_pass, dataUser.usr_pass)

        if (dataUser?.usr_username !== userForm.usr_username || verifyPass !== true) {
            return NextResponse.json({ message: 'Revise os campos e tente novamente' }, { status: 401 })
        }

        return NextResponse.json({ message: 'tudo certo' }, { status: 201 })

    } catch (error) {
        console.error(error)
    }
}


function formMap(form: { username: string, pass: string }) {
    return {
        usr_username: form.username,
        usr_pass: form.pass
    }
}

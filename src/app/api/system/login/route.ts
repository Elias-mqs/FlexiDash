import { FormsCrypt, JwtService, PassCrypt } from "@/services";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUser } from "@/utils/database/repositories/system/sysUsers";
import { remapUsers } from "@/utils/remappers";

export async function POST(request: Request) {

    const formData = await request.json()
    const { username, pass }: { username: string, pass: string } = FormsCrypt.verifyData(formData)

    if (!username || !pass) {
        return NextResponse.json({ message: 'Verifique os campos e tente novamente' }, { status: 400 });
    }

    const userForm = remapUsers.srcUser({ username, pass });

    try {
        const userDb = await findUser({ usr_username: userForm.usr_username });

        if (userDb.length < 1) {
            return NextResponse.json({ message: 'Usuário inválido' }, { status: 401 });
        }

        const dataUser = userDb[0];

        const verifyPass = await PassCrypt.verifyPassword(userForm.usr_pass, dataUser.usr_pass);

        if (verifyPass !== true) {
            return NextResponse.json({ message: 'Senha inválida' }, { status: 401 });

        } else {
            const accessToken = JwtService.signIn({ usrId: dataUser.usr_id });

            if (accessToken === 'JWT_SECRET_NOT_FOUND') {
                return NextResponse.json({ message: 'Erro interno contate a TI' }, { status: 500 });
            }

            cookies().set('ssnAuth', accessToken, {
                httpOnly: true,
                // secure: true, DEIXAR TRUE SOMENTE QUANDO COLOCAR NO AR. O SECURE É PARA LIBERAR O COOKIE QUANDO O SITE TIVER SSL
                maxAge: 60 * 60 * 24,
                sameSite: 'strict',
                path: '/'
            })

            return NextResponse.json({ message: 'Usuário autorizado' }, { status: 200 });
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 });
    }
}
 
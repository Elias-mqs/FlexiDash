import { FormsCrypt } from "@/services";
import { NextResponse } from "next/server";
import { findUser, createUser, findUserById } from "@/utils/database/repositories/sysUsers";
import { remapUsers } from "@/utils/remappers";
import { db } from "@/utils/database/database";


interface FormProps {
    name: string
    email: string
    username: string
    pass: string
}

export async function POST(request: Request) {

    const formData = await request.json();
    const userForm: FormProps = FormsCrypt.verifyData(formData);

    if (!userForm.name || !userForm.email || !userForm.username || !userForm.pass) {
        return NextResponse.json({ message: 'Verifique os campos e tente novamente' }, { status: 400 });
    }

    const userMap = remapUsers.createUser({ ...userForm, ativo: true });

    try {
        const userDb = await findUser({ usr_username: userForm.username, usr_email: userForm.email });
        const dataUserDb = userDb[0];

        if (!!dataUserDb) {
            if (dataUserDb.usr_email === userMap.usr_email) {
                return NextResponse.json({ message: 'Email já cadastrado' }, { status: 409 });
            }
            if (dataUserDb.usr_username === userMap.usr_username) {
                return NextResponse.json({ message: 'Nome de usuário já cadastrado' }, { status: 409 });
            }
            return NextResponse.json({ message: 'Usuário já cadastrado' }, { status: 409 });
        }

        createUser(userMap);

        return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 });
    }
}


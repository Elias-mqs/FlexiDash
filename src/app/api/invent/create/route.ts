import { NextResponse } from "next/server";
import dayjs from 'dayjs';
import { createInv, findInventByCod } from "@/utils/database/repositories/invDocuments";


interface FormProps {
    document: string
    armaz: string
    idUser: number
}

interface FormCompletedProps extends FormProps {
    dateStart: string
    status: 'aberto' | 'encerrado'
}

export async function POST(request: Request){

    const form: FormProps = await request.json();

    if(!form.armaz || !form.document || !form.idUser){
        return NextResponse.json({ message: 'Dados invalidos', title: 'Erro 400' }, { status: 400 })
    }

    const data: FormCompletedProps = {...form, dateStart: dayjs().format('DD-MM-YYYY HH:mm'), status: 'aberto'}

    const dataInvent = formMap(data)


    console.log(dataInvent)
    console.log('chegou aqui')



    try{

        const verifyDoc = await findInventByCod(dataInvent.doc_codInv);

        if(verifyDoc?.doc_codInv !== dataInvent.doc_codInv && verifyDoc?.doc_armaz !== dataInvent.doc_armaz && verifyDoc?.doc_inicio !== dataInvent.doc_inicio){

            const createInventory = await createInv(dataInvent)

            console.log(createInventory)

            return NextResponse.json({ message: 'Inventário criado', titulo: 'Sucesso' }, { status: 201 })
        }

        return NextResponse.json({ message: 'Inventário já existe', titulo: 'Atenção' }, { status: 409 })


    }catch(error){
        console.log(error)
        console.error(error)
    }
}


function formMap(form: FormCompletedProps){
    return { 
        doc_codInv: form.document,
        doc_status: form.status,
        doc_armaz: form.armaz,
        doc_usrIni: form.idUser,
        doc_inicio: form.dateStart
     }
}
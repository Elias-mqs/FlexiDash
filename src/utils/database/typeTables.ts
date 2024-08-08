import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    user: UserTable,
    inv_documents: InventarioTable,
    pet: PetTable
}


//TABELA USER, FUTURAMENTE VOU CORRIGIR ESSE SCHEMA
export interface UserTable {
    id: Generated<number>

    first_name: string
    gender: 'man' | 'woman' | 'other'

    last_name: string | null
    created_at: ColumnType<Date, string | undefined, never>

    metadata: JSONColumnType<{
        login_at: string
        ip: string | null
        agent: string | null
        plan: 'free' | 'premium'
    }>
}

export type Person = Selectable<UserTable>
export type NewPerson = Insertable<UserTable>
export type PersonUpdate = Updateable<UserTable>



export interface InventarioTable {
    doc_id: Generated<number>               //ID DO DOCUMENTO
    doc_codInv: string                      //CODIGO DO INVENTARIO É O NUMERO DO DOCUMENTO NO TOTVS
    doc_status: 'aberto' | 'encerrado'
    doc_armaz: string
    doc_usrIni: number                      //ID DO USER QUE ABRIU
    doc_inicio: string                      //DATA DE INICIO DO INVENTARIO
    doc_usrEnc: number | null               //ID DO USER QUE FECHOU
    doc_fim: string | null                  //DATA DO ENCERRAMENTO DO INVENTARIO
}

export type Inventory = Selectable<InventarioTable>
export type NewInventory = Insertable<InventarioTable>
export type InventoryUpdate = Updateable<InventarioTable>



export interface PetTable {
    id: Generated<number>
    name: string
    owner_id: number
    species: 'dog' | 'cat'
}

export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
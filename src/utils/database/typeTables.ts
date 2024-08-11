import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    sys_users: UserTable,
    inv_documents: InventarioTable,
    pet: PetTable
}



export interface UserTable {
    usr_id: Generated<number>
    usr_name: string
    usr_username: string
    usr_email: string
    usr_pass: string
    usr_ativo: boolean      // VERIFICAR SE DA PARA SER BOOLEAN, OU SE VAI PRECISAR SER 1 OU 0 POR CAUSA DO BANCO
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>



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
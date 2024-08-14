import { Generated, Insertable, Selectable, Updateable } from "kysely"


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
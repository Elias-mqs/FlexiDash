import { InventarioTable } from "../inv_documents"
import { UserTable } from "../sys_users"

export interface Database {
    sys_users: UserTable,
    inv_documents: InventarioTable,
}
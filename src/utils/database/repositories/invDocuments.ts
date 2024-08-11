import { db } from '../database';
import { Inventory, NewInventory, InventoryUpdate } from '../typeTables';

export async function findInventByCod(codInv: string) {
    return await db.selectFrom('inv_documents')
        .where('doc_codInv', '=', codInv)
        .selectAll()
        .executeTakeFirst()
}

export async function findInvent(criteria: Partial<Inventory>) {
    let query = db.selectFrom('inv_documents')

    if (criteria.doc_codInv) {
        query = query.where('doc_codInv', '=', criteria.doc_codInv)
    }

    if (criteria.doc_status) {
        query = query.where('doc_status', '=', criteria.doc_status)
    }

    if (criteria.doc_armaz) {
        query = query.where('doc_armaz', '=', criteria.doc_armaz)
    }

    if (criteria.doc_usrIni) {
        query = query.where('doc_usrIni', '=', criteria.doc_usrIni)
    }

    if (criteria.doc_usrEnc) {
        query = query.where('doc_usrEnc', '=', criteria.doc_usrEnc)
    }

    if (criteria.doc_inicio) {
        query = query.where('doc_inicio', 'like', `${criteria.doc_inicio}%`)
    }

    if (criteria.doc_fim) {
        query = query.where('doc_fim', 'like', `${criteria.doc_fim}%`)
    }

    return await query.selectAll().execute()
}

export async function createInv(inventory: NewInventory) {
    await db.insertInto('inv_documents')
        .values(inventory)
        .executeTakeFirstOrThrow()

    return await findInventByCod(inventory.doc_codInv)
}

export async function updateInventory(codInv: string, updateWith: InventoryUpdate) {
    await db.updateTable('inv_documents').set(updateWith).where('doc_codInv', '=', codInv).execute()
}
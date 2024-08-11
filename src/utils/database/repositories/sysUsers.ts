import { db } from '../database';
import { User, NewUser, UserUpdate } from '../typeTables';

export async function findUserById(usrId: string) {
    return await db.selectFrom('sys_users')
        .where('usr_id', '=', usrId)
        .selectAll()
        .executeTakeFirst()
}

export async function findUser(criteria: Partial<User>) {
    let query = db.selectFrom('sys_users')

    if (criteria.usr_name) {
        query = query.where('usr_name', '=', criteria.usr_name)
    }

    if (criteria.usr_username) {
        query = query.where('usr_username', '=', criteria.usr_username)
    }

    if (criteria.usr_email) {
        query = query.where('usr_email', '=', criteria.usr_email)
    }

    if (criteria.usr_pass) {
        query = query.where('usr_pass', '=', criteria.usr_pass)
    }

    if (criteria.usr_ativo) {
        query = query.where('usr_ativo', '=', criteria.usr_ativo)
    }

    return await query.selectAll().execute()
}

export async function createUser(user: NewUser) {
    await db.insertInto('sys_users')
        .values(user)
        .executeTakeFirstOrThrow()

    return await findUserById(user.usr_id)
}

export async function updateUser(usrId: string, updateWith: UserUpdate) {
    await db.updateTable('sys_users').set(updateWith).where('usr_id', '=', usrId).execute()
}
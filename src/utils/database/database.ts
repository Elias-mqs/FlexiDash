import { Database } from "./typeTables";
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';

const dialect = new MysqlDialect({
    pool: createPool({
        database: 'h2l-apps',
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        connectionLimit: 10
    })
})

export const db = new Kysely<Database>({
    dialect,
})
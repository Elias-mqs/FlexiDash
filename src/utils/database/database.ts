import { Database } from "./typeTables";
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';


const dialect = new MysqlDialect({
    pool: createPool({
        database: process.env.DB_NAME,
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT),
        connectionLimit: Number(process.env.DB_LIMIT)
    })
})

export const db = new Kysely<Database>({
    dialect,
})
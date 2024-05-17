import { IDatabaseConfig } from "./dbConfig.interface";
import { Dialect } from "@sequelize/core";

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB as string,
        host: process.env.POSTGRES_HOST as string,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres' as Dialect,
        dialectOptions: {
            useUTC: true
        },
        quoteIdentifiers: false,
    },
    test: {
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB as string,
        host: process.env.POSTGRES_HOST as string,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres' as Dialect,
        dialectOptions: {
            useUTC: true
        },
        quoteIdentifiers: false,
    },
    production: {
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB as string,
        host: process.env.POSTGRES_HOST as string,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres' as Dialect,
        dialectOptions: {
            useUTC: true
        },
        quoteIdentifiers: false,
    },
}

//console.log('databaseConfig: ', databaseConfig.development);
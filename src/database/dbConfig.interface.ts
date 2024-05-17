import { Dialect } from "@sequelize/core";

export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: string;
    dialect?: Dialect;
    urlDatabase?: string;
    quoteIdentifiers: boolean;
    dialectOptions: {
        useUTC: boolean;
    },
};

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    test: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from 'constant';
import { Dialect } from "@sequelize/core";

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV as any) {
        case DEVELOPMENT:
          config = {
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB as string,
            host: process.env.POSTGRES_HOST as string,
            port: parseInt(process.env.POSTGRES_PORT),
            dialect: 'postgres' as Dialect,
            dialectOptions: {
              useUTC: true
            },
            quoteIdentifiers: false,
          };

          break;
        case TEST:
          config = {
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
          };
          break;
        case PRODUCTION:
          config = {
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
          };
          break;
        default:
          config = {
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
          };
      }

      const sequelize = new Sequelize(config);
      console.log('NODE_ENV: ', process.env.NODE_ENV);
      console.log('config: ', config);
      sequelize.addModels([
      ]);
      //await sequelize.sync({force: true});
      return sequelize;
    },
  },
];

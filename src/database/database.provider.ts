import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from 'constant';
import { Dialect } from "@sequelize/core";
import { Role } from './dabaseModels/role.entity';
import { User } from './dabaseModels/user.entity';
import {PetType} from "./dabaseModels/pet_type.entity"
import { PetBreed } from './dabaseModels/pet_breed.entity';
import { Pet } from './dabaseModels/pet.entity';
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
            username: process.env.POSTGRES_USERNAME_PRODUCTION,
            password: process.env.POSTGRES_PASSWORD_PRODUCTION,
            database: process.env.POSTGRES_DB_PRODUCTION as string,
            host: process.env.POSTGRES_HOST_PRODUCTION as string,
            port: parseInt(process.env.POSTGRES_PORT_PRODUCTION),
            dialect: 'postgres' as Dialect,
            dialectOptions: {
              useUTC: true,
              ssl:{
                require: true,
                rejectUnauthorized: false
              }
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
            port: parseInt(process.env.POSTGRES_PORT),
            dialect: 'postgres' as Dialect,
            dialectOptions: {
              useUTC: true,
            },
          };
      }

      const sequelize = new Sequelize(config);
      console.log('NODE_ENV: ', process.env.NODE_ENV);
      console.log('config: ', config);
      console.log('sequelize: ', sequelize.options);
      sequelize.addModels([
        Role,
        User,
        PetType,
        PetBreed,
        Pet
      ]);
      //await sequelize.sync({force: true});
      return sequelize;

    },
  },
];

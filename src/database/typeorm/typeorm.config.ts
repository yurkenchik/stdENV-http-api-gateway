import * as dotenv from "dotenv";
// @ts-ignore
import * as process from "node:process";
import { DataSource, DataSourceOptions } from "typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity";
dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
    type: process.env.DB_DRIVER as 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    entities: [User, Role],
    // @ts-ignore
    migrations: [process.env.MIGRATIONS],
    // @ts-ignore
    seeds: ["src/database/seeders/create-roles.seed.ts"],
    factories: ["src/factories/role.factory.ts"],
    synchronize: true,
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;
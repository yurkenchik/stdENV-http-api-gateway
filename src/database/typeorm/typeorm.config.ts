import * as dotenv from "dotenv";
// @ts-ignore
import * as process from "node:process";
import { DataSource, DataSourceOptions } from "typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {SeederOptions} from "typeorm-extension";
dotenv.config()

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    entities: [User, Role],
    migrations: [__dirname + process.env.MIGRATIONS],
    seeds: [],
    factories: [],
    synchronize: true,
}

console.log("DB DRIVER: ", process.env.DB_DRIVER);
console.log("DB TYPE: ", dataSourceOptions.type);

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
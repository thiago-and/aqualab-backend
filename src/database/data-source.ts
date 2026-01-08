import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "aqualab",

    synchronize: false,
    logging: false,

    entities: [__dirname + "/../entities/**/*.{ts,js}"],
    migrations: [__dirname + "/migrations/**/*.{ts,js}"],
});

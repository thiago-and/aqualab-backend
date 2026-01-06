import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    migrations: ["./src/database/migrations/*.ts"],
    entities: [ __dirname + "/../entities/**/*.{ts,js}" ],
});
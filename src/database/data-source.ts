import { DataSource } from "typeorm";
import { Year } from "../entities/Year";
import { Teacher } from "../entities/Teacher";
import { Student } from "../entities/Student";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    migrations: ["./src/database/migrations/*.ts"],
    entities: [
        Year,
        Teacher,
        Student
    ],
});
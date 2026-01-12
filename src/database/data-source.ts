import { DataSource } from "typeorm";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: isProd
    ? ["build/entities/**/*.{js}"]
    : ["src/entities/**/*.{ts}"],

  migrations: isProd
    ? ["build/database/migrations/**/*.{js}"]
    : ["src/database/migrations/**/*.{ts}"],

  synchronize: false,
  logging: false,
});

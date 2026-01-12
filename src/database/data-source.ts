import { DataSource } from "typeorm";

// Considera ambiente de produção também quando executando a versão compilada em /build
const isProd = process.env.NODE_ENV === "production" || __dirname.includes("build");

export const AppDataSource = new DataSource({
    type: (process.env.DB_TYPE as any) || "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    synchronize: false,
    logging: false,

    entities: isProd
        ? ["build/**/entities/**/*.js", "build/**/**.entity.js"]
        : ["src/**/entities/**/*.ts", "src/**/**.entity.ts"],

    migrations: isProd
        ? ["build/database/migrations/**/*.js"]
        : ["src/database/migrations/**/*.ts"],
});

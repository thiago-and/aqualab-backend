import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Equivalente ao que o --init oferecia
  verbose: true,
  clearMocks: true,

  // Onde ficam os testes
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],

  // Cobertura (opcional – você pode remover)
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
};

export default config;

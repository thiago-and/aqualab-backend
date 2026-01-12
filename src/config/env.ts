import 'dotenv/config';

const defaults = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USER: 'root',
  DB_PASSWORD: '',
  DB_NAME: 'aqualab',
  NODE_ENV: 'development',
  PORT: '3333',
  JWT_SECRET: 'chave_dev_altere_em_producao',
  JWT_EXPIRES_IN: '1d'
} as const;

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN'
];

for (const key of required) {
  if (!process.env[key]) {
    if (process.env.NODE_ENV === 'production' && (key === 'DB_PASSWORD' || key === 'JWT_SECRET')) {
      throw new Error(`Variável de ambiente obrigatória ausente em produção: ${key}`);
    }

    process.env[key] = defaults[key as keyof typeof defaults];
  }
}
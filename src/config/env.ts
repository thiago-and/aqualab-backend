import "dotenv/config";

const required = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "NODE_ENV",
  "PORT",
  "JWT_SECRET",
  "JWT_EXPIRES_IN"
]

for (const key of required) {
  if (!process.env[key] && key !== "DB_PASSWORD") {
    throw new Error(`Missing env var: ${key}`)
  }
}

if (!process.env.DB_PASSWORD && process.env.NODE_ENV === "production") {
  throw new Error(`Missing env var: DB_PASSWORD`)
}
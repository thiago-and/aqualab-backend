# ===============================
# STAGE 1 — Dependencies
# ===============================
FROM node:21-alpine AS deps

WORKDIR /app

COPY package*.json ./

# npm ci é mais rápido e previsível em produção
RUN npm ci


# ===============================
# STAGE 2 — Build
# ===============================
FROM node:21-alpine AS build

WORKDIR /app

# reaproveita node_modules do stage anterior
COPY --from=deps /app/node_modules ./node_modules

COPY tsconfig*.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run build


# ===============================
# STAGE 3 — Runtime (produção)
# ===============================
FROM node:21-alpine

WORKDIR /app

ENV NODE_ENV=production

# somente o necessário para rodar
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/scripts ./scripts

RUN chmod +x scripts/wait-for-db.sh

EXPOSE 3000

CMD ["sh", "-c", "echo 'Running migrations...' && ./scripts/wait-for-db.sh && npm run migration:run && echo 'Starting API...' && npm run start"]

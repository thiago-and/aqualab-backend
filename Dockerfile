FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY src ./src
COPY scripts/wait-for-db.sh ./scripts/wait-for-db.sh

RUN npm run build
RUN chmod +x scripts/wait-for-db.sh

EXPOSE 3000

CMD ["sh", "-c", "echo 'Running migrations...' && ./scripts/wait-for-db.sh && npm run migration:run && echo 'Starting API...' && npm run start"]

FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN chmod +x wait-for-db.sh

EXPOSE 3000

CMD ["sh", "-c", "./wait-for-db.sh && npm run migration:run && npm run start"]

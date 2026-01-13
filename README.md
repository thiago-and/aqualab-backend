# Aqualab Backend

Node/Express + TypeORM API for the Aqualab educational platform (Aqualab - Laboratório da EE Barão Ramalho). Provides authentication, teacher/student/year management, quizzes and attempts.

## Tech stack
- Node.js + Express (ES modules via TypeScript build output)
- TypeORM (MySQL; sqlite available for lightweight use)
- JWT auth (Bearer)
- Class-validator/transformer for DTO validation

## Requirements
- Node 18+
- MySQL 8+ (or compatible like MariaDB) with a database created (default: `aqualab`)
- `npm` or `yarn`

## Environment variables
Required (see build/config/env.js):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `NODE_ENV`
- `PORT` (API listen port; defaults to 3000 if unset)
- `JWT_SECRET`, `JWT_EXPIRES_IN`

Create a `.env` file (see `.env.example`) before running the app:
```env
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=1d
```

## Install & run
```bash
git clone https://github.com/thiago-and/aqualab-backend
cd aqualab-backend
npm install
npm run migration:run (database needs to be up)
npm run build
npm start
```
Dev mode with hot reload:
```bash
npm run migration:run
npm run dev
```

## Database
TypeORM config is in `src/database/data-source.ts` (defaults: host `localhost`, port `3306`, user `root`, db `aqualab`). Update it or use env-driven overrides if you adjust the data source.
Example MySQL Docker:
```bash
docker run -d \
  --name mysql \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=aqualab \
  -p 3306:3306 \
  -v /opt/aqualab/mysql-data:/var/lib/mysql \ #(for windows use path like C:/aqualab/mysql-data:/var/lib/mysql)
  mysql:lts \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci
```

Migrations (adjust datasource path if moved):
```bash
npm run migration:generate -- NameHere
npm run migration:run
npm run migration:revert
```

## API overview (prefix: `/api`)
- Auth: `POST /auth/login`
- Teachers: `POST /teachers` (public signup), `GET/PUT/DELETE /teachers/:id` (auth)
- Students: `POST /students` (teacher-auth), `GET /students`, etc.
- Years: `POST /years`, `GET /years`, `PUT /years/:id`, `DELETE /years/:id` (teacher-auth)
- Quizzes: `POST /quizzes`, `GET /quizzes`, `GET /quizzes/:id`, `PUT/DELETE /quizzes/:id` (auth; teacher-only for write)
- Student quizzes: `GET /quizzes/student/:studentId` lists available quizzes for the authenticated student
- Quiz attempts: see routes under `src/routes/quizzes`

Auth middleware requires `Authorization: Bearer <token>`; `ensureTeacher` restricts teacher-only actions.

## CORS
Currently wide open (`cors()` with OPTIONS handler) in `src/server.ts`. Tighten origins/methods as needed for production.


## Project layout
- `src/server.ts` – app bootstrap and routing
- `src/routes` – Express route definitions
- `src/controllers` – HTTP controllers
- `src/services` – business logic
- `src/repositories` – data access (TypeORM EntityManager)
- `src/entities` – TypeORM entities
- `src/database` – data source and migrations

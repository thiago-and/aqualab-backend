# Aqualab Backend

## Visão Geral
O Aqualab Backend é uma API REST em TypeScript que modela um sistema educacional sobre o ciclo da água. Ele organiza alunos, professores e séries (anos escolares) usando o TypeORM com SQLite, aplica validações com `class-validator` e protege as rotas sensíveis com autenticação JWT.

## Tecnologias principais
- Node.js + TypeScript
- Express 5 com middlewares customizados
- TypeORM (SQLite, migrações e entidades)
- JWT para autenticação e `bcryptjs` para hash de senhas
- `class-transformer` + `class-validator` para DTOs
- Jest + ts-jest para testes unitários

## Estrutura do projeto
- `src/server.ts`: ponto de entrada, inicializa o TypeORM e monta os `Router`s em `/api`.
- `routes/*`: expõe os endpoints organizados por recurso (Auth, Students, Teachers, Years).
- `controllers/*`: recebem o request, aplicam a validação e devolvem respostas HTTP.
- `services/*`: contêm as regras de negócio e orquestram repositórios.
- `repositories/*`: operam diretamente sobre o banco via `EntityManager` do TypeORM.
- `entities/*`: mapeiam as tabelas `students`, `teachers` e `years`.
- `dtos/*`: definem o contrato de entrada para criação/atualização.
- `middlewares/*`: cuidam da autenticação (`authMiddleware`) e controle de papel (`ensureTeacher`).
- `database/data-source.ts`: configuração do TypeORM apontada para `./src/database/db.sqlite`.

## Configuração e execução
### Pré-requisitos
- Node.js 18+ compatível com `npm`.
- Ambiente que suporte SQLite (arquivo `db.sqlite` criado automaticamente pelo TypeORM).

### Variáveis de ambiente obrigatórias
Crie um `.env` na raiz com pelo menos:
```
JWT_SECRET=algum-segredo-curto-mas-forte
```

### Passos de instalação
1. `npm install`
2. `npm run migration:run` (aplica as migrations em `src/database/migrations`).
3. `npm run dev` (usa `ts-node-dev` e sobe o servidor em `http://localhost:3333`).

### Scripts úteis
| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Dev server com reload rápido. |
| `npm run build` | Limpa `./build` e compila TS. |
| `npm run start` | Executa `build/index.js` após um `npm run build`. |
| `npm run test` | Executa os testes Jest. |
| `npm run migration:run` | Aplica migrações no banco SQLite. |
| `npm run migration:revert` | Desfaz a última migration aplicada. |
| `npm run migration:create` / `migration:generate` | Cria novas migrations com o CLI do TypeORM. |

## Modelo de domínio
### Student (`students`)
- `id`: UUID gerado automaticamente.
- `name`: string obrigatória.
- `enrollmentNumber`: número único obrigatório.
- `year`: relação ManyToOne com `Year`.
- `teacher`: relação ManyToOne com `Teacher` (opcional).

### Teacher (`teachers`)
- `id`, `name`, `enrollmentNumber`, `email`, `password` (bcrypt com `salt=10`).
- `years`: OneToMany para `Year`.
- `students`: OneToMany para `Student`.

### Year (`years`)
- `year`: número da série (ex: 1, 2, 3).
- `teacher`: ManyToOne com o professor responsável.
- `students`: OneToMany com alunos.

### DTOs básicos
- `CreateStudentDto`: exige `name`, `enrollmentNumber` e `year` (todos obrigatórios). Usa `class-validator`.
- `UpdateStudentDto`: contempla campos `name`, `enrollmentNumber`, `yearId` como opcionais.
- `CreateTeacherDto`: exige `name`, `enrollmentNumber`, `email` válido e `password` com ao menos 5 caracteres.
- `UpdateTeacherDto`: permite atualizar `name`, `enrollmentNumber`, `password` e `yearId` sem obrigatoriedade.

## Fluxo de requisição
1. `server.ts` inicializa o `AppDataSource` e monta os routers em `/api`.
2. Cada rota usa uma factory (`makeStudentController`, etc.) para criar controller → service → repositório.
3. Controllers recebem o `Request`, aplicam validação ou verificações manuais e delegam para os services.
4. Services usam repositories para consultar/alterar o banco e, quando necessário, `AuthService` gera tokens JWT (com `expiresIn: 1d`).
5. `authMiddleware` verifica o header `Authorization: Bearer <token>` usando `JWT_SECRET`, popula `request.user` e `ensureTeacher` impede acessos de alunos.

## Referência da API
### Autenticação
| Método | Endpoint | Corpo esperado | Retorno | Observações |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/teacher/login` | `{ "email": string, "password": string }` | `{ "token": string }` | Gera JWT com `role: teacher`. |
| POST | `/api/auth/student/login` | `{ "enrollmentNumber": number }` | `{ "token": string }` | Gera JWT com `role: student`. |

### Students
| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/api/students` | Cria aluno (body com `name`, `enrollmentNumber`, `year`). |
| GET | `/api/students` | Lista todos os alunos com relações (year, teacher). |
| GET | `/api/students/:id` | Recupera um aluno específico (UUID). |
| PUT | `/api/students/:id` | Atualiza campos parciais do aluno. |
| DELETE | `/api/students/:id` | Exclui o aluno (204). |

### Teachers
| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/api/teachers` | Cria professor (hash `password`). |
| GET | `/api/teachers` | Lista todos os professores. |
| GET | `/api/teachers/:id` | Retorna professor por UUID. |
| PUT | `/api/teachers/:id` | Atualiza campos. |
| DELETE | `/api/teachers/:id` | Remove professor. |

### Years (exigem token de professor)
| Método | Endpoint | Descrição | Autenticação |
| --- | --- | --- | --- |
| POST | `/api/years` | Cria uma série (`{ "year": number }`). | `Bearer <token>` com `role: teacher` |
| GET | `/api/years` | Lista séries com professores e alunos. | mesmo token |
| GET | `/api/years/:id` | Retorna série por número (rodando `getYearByYear`). | mesmo token |
| PUT | `/api/years/:id` | Atualiza série. | mesmo token |
| DELETE | `/api/years/:id` | Remove série. | mesmo token |

## Autorização e segurança
- A autenticação define `request.user` com `{ id, role }`.
- `ensureTeacher` garante que apenas tokens com `role: teacher` acessem as rotas de séries.
- Tokens expiram em 1 dia (`expiresIn: "1d"`).
- O corpo das requisições é validado com os DTOs antes de chegar ao repositório.

## Banco de dados e migrações
- O arquivo `AppDataSource` aponta para `./src/database/db.sqlite` e carrega as entidades.
- Migrations ficam em `src/database/migrations`. Rode `npm run migration:run` para aplicar todas.
- Para resetar o banco, delete `db.sqlite` e rode a migration novamente.

## Testes
- `npm run test` dispara os testes Jest/ts-jest e respeita os arquivos `jest.config.ts` e `tsconfig.json`.

## Considerações finais
- Todas as rotas de CRUD seguem o padrão controller → service → repository com dependências resolvidas nas factories.
- Garanta que `JWT_SECRET` esteja definido antes de iniciar o servidor, pois a autenticação falha sem ele.
- O servidor responde em `http://localhost:3333` e expõe `/api` para os recursos descritos.

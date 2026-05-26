# Tech Challenge - Full Stack (Fase 3)

Aplicação de blogging full stack com:
- Back-end REST em Node.js + Express + Prisma + PostgreSQL
- Front-end em React para consumo dos endpoints e gestão de postagens

## Objetivo
Implementar a interface gráfica da aplicação de blogging para docentes e estudantes, consumindo os endpoints REST já existentes no back-end.

## Stack

### Back-end
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Jest + Supertest

### Front-end
- React
- React Router
- Fetch API
- CSS responsivo (layout adaptável para mobile e desktop)

## Estrutura

```bash
.
├── src/                    # Back-end (API)
├── prisma/                 # Schema + migrations
├── frontend/               # Front-end React
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── Dockerfile
├── docker-compose.yml
└── Dockerfile              # Back-end
```

## Requisitos de ambiente
- Node.js (LTS)
- Docker + Docker Compose
- NPM

## Variáveis de ambiente

### Back-end (`.env` na raiz)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tech_challenge"
```

### Front-end (`frontend/.env`)
Use o arquivo de exemplo:
```bash
cp frontend/.env.example frontend/.env
```

Conteúdo padrão:
```env
VITE_API_URL=http://localhost:3000
VITE_PROFESSOR_USER=professor
VITE_PROFESSOR_PASSWORD=123456
```

## Como executar

### Opção 1: Docker (recomendado)
```bash
docker compose up --build
```

Serviços:
- API: `http://localhost:3000`
- Front-end: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

### Opção 2: Local (sem Docker)

#### Back-end
```bash
npm install
npm run dev
```

#### Front-end
```bash
cd frontend
npm install
npm run dev
```

## Banco de dados
Modelo principal: `Post`
- `id` (Int, PK)
- `title` (String)
- `content` (String)
- `author` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

Migration:
```bash
npx prisma migrate dev
```

## Endpoints da API
Base URL: `http://localhost:3000`

- `GET /posts` - listar posts
- `GET /posts/:id` - buscar post por ID
- `POST /posts` - criar post
- `PUT /posts/:id` - atualizar post
- `DELETE /posts/:id` - excluir post
- `GET /posts/search?q=termo` - busca textual

## Front-end (React)

### Páginas implementadas
- Página principal (lista de posts + busca)
- Página de leitura de post
- Página de criação de postagens
- Página de edição de postagens
- Página administrativa (listar/editar/excluir)
- Login de professor

### Autenticação e autorização
A autenticação está implementada no front-end com credenciais de professor via variáveis de ambiente. As rotas abaixo são protegidas:
- `/posts/new`
- `/posts/:id/edit`
- `/admin`

### Arquitetura do front-end
- `src/api/postsApi.js`: camada de integração com API REST
- `src/context/AuthContext.jsx`: estado global de autenticação
- `src/components/ProtectedRoute.jsx`: guarda de rotas privadas
- `src/pages/*`: páginas por responsabilidade

## Testes

### Back-end
```bash
npm test
npm run test:coverage
```

## Observações técnicas
- CORS habilitado no back-end para permitir consumo da API pelo front-end.
- O front-end usa `VITE_API_URL` para desacoplar ambiente local e container.

## Documentação complementar
- Arquitetura, uso e relato de desafios: [docs/documentacao-arquitetura-uso-e-desafios.md](docs/documentacao-arquitetura-uso-e-desafios.md)

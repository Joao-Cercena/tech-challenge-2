# Tech Challenge - Full Stack (Fase 4)

Aplicação full stack com:
- Back-end REST em Node.js + Express + Prisma + PostgreSQL
- Front-end em React para consumo dos endpoints e gestão de postagens

## Repositório GitHub
- https://github.com/Joao-Cercena/tech-challenge-2

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
├── mobile/                 # Aplicativo React Native com Expo
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── navigation/
│       └── screens/
├── docs/                   # Documentação técnica e guia de apresentação
├── docker-compose.yml
└── Dockerfile              # Back-end
```

## Requisitos de ambiente
- Node.js (LTS)
- Docker + Docker Compose
- NPM

## Variáveis de ambiente

### Back-end (`.env` na raiz)

Crie o arquivo local a partir do exemplo:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="defina-um-segredo-longo-e-exclusivo-por-ambiente"
```

`JWT_SECRET` é obrigatório para login e rotas protegidas. Nunca reutilize o valor de desenvolvimento em produção ou o versione no repositório.

### Front-end (`frontend/.env`)
Use o arquivo de exemplo:
```bash
cp frontend/.env.example frontend/.env
```

Conteúdo padrão:
```env
VITE_API_URL=http://localhost:3000
```

## Como executar

### Opção 1: Docker (recomendado)

Antes de iniciar, configure `JWT_SECRET` no `.env`. O Compose interrompe a inicialização da API se a variável estiver ausente.

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
Modelos:

`Post`
- `id` (Int, PK)
- `title` (String)
- `content` (String)
- `author` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

`Professor`
- `id` (Int, PK)
- `name` (String)
- `username` (String, único)
- `password` (hash bcrypt; nunca retornado pela API)

`Student`
- `id` (Int, PK)
- `name` (String)
- `username` (String, único)

Migration:
```bash
npx prisma migrate dev
```

Em ambientes de implantação, execute as migrations já versionadas com:

```bash
npx prisma migrate deploy
```

A migration mais recente preserva o professor de desenvolvimento criado na migration histórica e converte sua senha para hash. Para desenvolvimento local, o usuário histórico é `professor` e a senha é `123456`; essas credenciais já existiam no projeto e não devem ser usadas em produção.

## Endpoints da API
Base URL: `http://localhost:3000`

- `GET /posts` - listar posts
- `GET /posts/:id` - buscar post por ID
- `POST /posts` - criar post
- `PUT /posts/:id` - atualizar post
- `DELETE /posts/:id` - excluir post
- `GET /posts/search?q=termo` - busca textual

### Autenticação

- `POST /auth/login` - login de professor; recebe `username` e `password` e retorna um JWT e dados públicos mínimos do professor.

Envie o token recebido nas rotas protegidas:

```http
Authorization: Bearer <token>
```

### Professores (todas protegidas)

- `POST /professors` - criar professor
- `GET /professors?page=1&limit=10` - listar professores paginado
- `GET /professors/:id` - buscar professor por ID
- `PUT /professors/:id` - editar professor
- `DELETE /professors/:id` - excluir professor

### Estudantes (todas protegidas)

- `POST /students` - criar estudante
- `GET /students?page=1&limit=10` - listar estudantes paginado
- `GET /students/:id` - buscar estudante por ID
- `PUT /students/:id` - editar estudante
- `DELETE /students/:id` - excluir estudante

As listagens paginadas retornam `{ data, pagination }`, em que `pagination` contém `page`, `limit`, `total` e `totalPages`. O limite padrão é 10 e o máximo é 100.

## Front-end (React)

### Páginas implementadas
- Página principal (lista de posts + busca)
- Página de leitura de post
- Página de criação de postagens
- Página de edição de postagens
- Página administrativa (listar/editar/excluir)
- Login de professor

### Autenticação e autorização

- O front-end web realiza o login de professor por `POST /auth/login`; não compara credenciais no navegador.
- Após o login, o front-end guarda somente o token de acesso e a identificação mínima do professor. O token é enviado automaticamente nas operações de criar, editar e excluir posts.
- Professores autenticados podem criar, editar e excluir posts. As operações administrativas de professores e estudantes permanecem disponíveis somente na API nesta etapa.
- Leitura e busca de posts são públicas para permitir a visualização por estudantes.
- Estudantes não possuem login nem permissões de escrita nesta etapa.
- Senhas e hashes nunca são retornados pelas rotas da API.

### Arquitetura do front-end
- `src/api/apiClient.js`: requisições HTTP, parsing seguro de respostas e tratamento de token inválido.
- `src/api/authApi.js` e `src/api/postsApi.js`: integrações de autenticação e posts.
- `src/context/AuthContext.jsx`: estado global de autenticação
- `src/components/ProtectedRoute.jsx`: guarda de rotas privadas
- `src/pages/*`: páginas por responsabilidade

## Aplicativo mobile (React Native + Expo)

### Pré-requisitos e instalação

- Node.js LTS e npm;
- Expo Go em um dispositivo físico, ou um emulador Android/iOS já configurado.

```bash
cd mobile
cp .env.example .env
npm install
```

Defina `EXPO_PUBLIC_API_URL` em `mobile/.env` com a URL da API. Em dispositivo físico, use um host acessível pela rede local ou uma API implantada; `localhost` do computador não aponta para o dispositivo.

```env
EXPO_PUBLIC_API_URL=http://SEU_HOST_ACESSIVEL:3000
```

Inicie o Expo:

```bash
npm start
```

No terminal do Expo, abra no dispositivo com o Expo Go ou use `npm run android`/`npm run ios` quando houver emulador disponível. Não inclua segredos de produção no arquivo de ambiente mobile.

### Arquitetura e fluxo

- `src/api/`: cliente HTTP e contratos REST de autenticação, posts, professores e estudantes;
- `src/context/`: sessão do professor, persistida com `expo-secure-store`;
- `src/navigation/`: navegação pública e administrativa protegida;
- `src/screens/`: telas e fluxos do desafio;
- `src/components/`: botões, feedback e paginação reutilizáveis.

O aplicativo restaura a sessão ao abrir e armazena somente o token e a identificação mínima do professor. O token é incluído automaticamente em operações administrativas; uma resposta 401 remove a sessão e retorna o aplicativo à área pública.

Visitantes e estudantes podem listar, buscar e ler posts. Somente professor autenticado acessa criação, edição e administração de posts, professores e estudantes.

### Telas mobile

- Lista e busca de posts;
- Leitura completa de post;
- Login de professor;
- Criação e edição de posts;
- Administração de posts;
- Listagem paginada, criação e edição de professores;
- Listagem paginada, criação e edição de estudantes.

## Testes

### Back-end
```bash
npm test
npm run test:coverage
```

### Validação completa

```bash
npx prisma validate
npx prisma migrate status
npm test

cd frontend && npm run build
cd ../mobile && npx expo-doctor && npm run export:android
```

## Limitações intencionais

- Comentários são opcionais no enunciado e não foram implementados.
- Somente professores possuem login. Estudantes visualizam os posts pela área pública.
- Não há cadastro público, recuperação de senha, refresh token, uploads, notificações, likes, categorias ou recursos acadêmicos.

## Documentação de entrega

- [Documentação técnica](docs/technical-documentation.md)
- [Guia de apresentação de até 15 minutos](docs/presentation-guide.md)

## Observações técnicas
- CORS habilitado no back-end para permitir consumo da API pelo front-end.
- O front-end usa `VITE_API_URL` para desacoplar ambiente local e container.

# 📘 Tech Challenge - Fase 2

## API de Blogging (Node.js)

API REST desenvolvida para gerenciamento de postagens em uma plataforma de ensino, permitindo que professores criem conteúdos e alunos consumam essas informações de forma centralizada.

---

## 📌 Objetivo do Projeto

Este projeto faz parte do **Tech Challenge - Fase 2**, cujo objetivo é refatorar o back-end de uma aplicação de blogging utilizando Node.js, garantindo escalabilidade, organização e boas práticas de desenvolvimento.

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* PostgreSQL
* Prisma ORM (v5)
* Docker / Docker Compose
* Jest (testes)
* Supertest
* GitHub Actions (CI/CD)

---

## ⚙️ Setup do Projeto

### 🔧 Pré-requisitos

* Node.js (versão LTS)
* Docker + Docker Compose
* NPM

---

### 📥 Clonar o repositório

```bash
git clone https://github.com/seu-usuario/tech-challenge.git
cd tech-challenge
```

---

### 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tech_challenge"
```

---

### 🐳 Rodando com Docker (recomendado)

```bash
docker compose up --build
```

Isso irá subir:

* API Node.js (porta 3000)
* Banco PostgreSQL (porta 5432)

---

### 🧱 Rodando migrations

```bash
npx prisma migrate dev
```

---

### ▶️ Rodando localmente (sem Docker)

```bash
npm install
npm run dev
```

---

## 🏗️ Arquitetura da Aplicação

O projeto segue uma **arquitetura em camadas**, separando responsabilidades para melhor manutenção e escalabilidade.

```
ROUTE → CONTROLLER → SERVICE → DATABASE
```

### 📂 Estrutura de pastas

```
src/
┣ controllers/
┣ routes/
┣ services/
┣ app.js
┣ server.js
┗ database.js
```

### 📌 Descrição das camadas

* **Routes** → Define os endpoints da API
* **Controllers** → Recebe requisições e retorna respostas
* **Services** → Contém a lógica de negócio
* **Database** → Integração com banco via Prisma

---

## 🗄️ Banco de Dados

Banco relacional utilizando PostgreSQL com ORM Prisma.

### 📄 Modelo: Post

```
id          Int (PK)
title       String
content     String
author      String
createdAt   DateTime
updatedAt   DateTime
```

---

## 🌐 Guia de Uso da API

### 🔹 Base URL

```
http://localhost:3000
```

---

### 📌 Endpoints

#### ✅ Listar todos os posts

```http
GET /posts
```

---

#### ✅ Buscar post por ID

```http
GET /posts/:id
```

---

#### ✅ Criar post

```http
POST /posts
```

**Body:**

```json
{
  "title": "Título do post",
  "content": "Conteúdo do post",
  "author": "Autor"
}
```

---

#### ✅ Atualizar post

```http
PUT /posts/:id
```

---

#### ✅ Deletar post

```http
DELETE /posts/:id
```

---

#### ✅ Buscar posts

```http
GET /posts/search?q=termo
```

---

## 🧪 Testes Automatizados

* Framework: Jest
* Testes de API: Supertest

### ▶️ Rodar testes

```bash
npm test
```

### 📊 Cobertura atual

* ✔ ~79% statements
* ✔ ~76% branches
* ✔ 100% functions

✅ Atende ao requisito mínimo de 20%

---

## 🐳 Docker

Serviços configurados:

* app → API Node.js
* db → PostgreSQL

Subir ambiente:

```bash
docker compose up --build
```

---

## 🤖 CI/CD (GitHub Actions)

Pipeline automatizado para:

* Instalar dependências
* Rodar migrations
* Executar testes
* Validar cobertura

Executado em:

* Push na branch main
* Pull Requests

---

## 📊 Status do Projeto

* ✔ CRUD completo
* ✔ Busca implementada
* ✔ Arquitetura em camadas
* ✔ Banco com Prisma
* ✔ Docker configurado
* ✔ Testes automatizados
* ✔ CI/CD funcional

---

## 🚀 Melhorias Futuras

* Autenticação com JWT
* Documentação com Swagger
* Validação com Zod ou Joi
* Middleware global de erros
* Testes mais robustos (erros 500)

---

## 📌 Considerações Finais

Este projeto foi desenvolvido com foco em:

* Boas práticas de desenvolvimento
* Organização de código
* Testabilidade
* Pronto para ambiente profissional e portfólio

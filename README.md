# 📘 Tech Challenge - Fase 2

## 📌 Objetivo do Projeto

Este projeto faz parte do **Tech Challenge - Fase 2**, cujo objetivo é criar uma API REST seguindo os requisitos funcionais.

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
git clone https://github.com/Joao-Cercena/tech-challenge-2.git
cd tech-challenge-2
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


### 📂 Estrutura de pastas

```
src/
┣ controllers/
┣ middlewares/
┣ routes/
┣ services/
┣ tests/
┣ app.js
┣ server.js
┗ database.js
```

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

**Body:**

```json
{
  "title": "Título do post atualizadp",
  "content": "Conteúdo do post atualizado",
  "author": "Autor atualizado"
}
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

# Documentação técnica — Tech Challenge Fase 4

## Objetivo e escopo

Esta entrega adiciona um aplicativo mobile em React Native/Expo à aplicação de blogging existente. O mobile consome a API REST para leitura de posts e, após login de professor, para operações administrativas de posts, professores e estudantes.

O escopo não inclui comentários, login de estudante, cadastro público, recuperação de senha, upload, notificações, categorias, likes ou recursos acadêmicos.

## Arquitetura

```text
Mobile React Native (Expo) ── HTTP/JSON ──┐
                                          │
Front-end web React/Vite ── HTTP/JSON ────┼── API Express/Prisma ── PostgreSQL
                                          │
                                          └── JWT Bearer nas operações protegidas
```

- `src/`: API Express, organizada em rotas, controllers, services e middlewares.
- `prisma/`: schema e migrations PostgreSQL.
- `frontend/`: cliente web React/Vite, compatibilizado com o login real da API.
- `mobile/`: cliente React Native com Expo.

## Módulos principais

### API

- `auth`: valida professor e emite JWT com expiração de 8 horas;
- `posts`: leitura e busca públicas; criação, edição e exclusão protegidas;
- `professors` e `students`: CRUD administrativo protegido, com paginação;
- `authenticate-professor`: valida o Bearer token antes das rotas administrativas;
- Prisma: persiste `Post`, `Professor` e `Student` no PostgreSQL.

### Mobile

- `mobile/src/api/`: cliente HTTP e contratos de autenticação, posts, professores e estudantes;
- `mobile/src/context/AuthContext.js`: restaura, persiste e remove a sessão com `expo-secure-store`;
- `mobile/src/navigation/RootNavigator.js`: separa a área pública da administrativa;
- `mobile/src/screens/`: telas de posts, login e administração;
- `mobile/src/components/`: controles reutilizáveis de feedback, botões e paginação.

## Autenticação e autorização

`POST /auth/login` recebe `username` e `password` e retorna um token e dados públicos mínimos do professor. As senhas são comparadas por hash bcrypt e não são retornadas pela API.

O web armazena token e identificação mínima no armazenamento local do navegador; o mobile utiliza `expo-secure-store`. O token é enviado apenas nas requisições administrativas. Em resposta 401, ambos os clientes encerram a sessão local. O servidor é a autoridade de autorização: rotas protegidas validam JWT e rotas públicas de posts não exigem login.

Professores autenticados podem modificar posts e administrar professores/estudantes. Estudantes não possuem login nesta entrega e visualizam os posts públicos.

## Fluxos de uso

### Visitante ou estudante

1. Abrir a lista de posts.
2. Buscar por palavra-chave ou selecionar um post.
3. Ler título, autor e conteúdo completo.
4. Fazer login apenas se for professor e precisar de funções administrativas.

### Professor

1. Informar credenciais no login.
2. Acessar a área administrativa após autenticação.
3. Criar, editar ou excluir posts.
4. Criar, editar, paginar ou excluir professores e estudantes.
5. Encerrar a sessão pelo logout.

## Endpoints consumidos pelo mobile

| Recurso | Operações |
| --- | --- |
| Autenticação | `POST /auth/login` |
| Posts públicos | `GET /posts`, `GET /posts/search?q=`, `GET /posts/:id` |
| Posts protegidos | `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` |
| Professores protegidos | `POST /professors`, `GET /professors?page=&limit=`, `GET /professors/:id`, `PUT /professors/:id`, `DELETE /professors/:id` |
| Estudantes protegidos | `POST /students`, `GET /students?page=&limit=`, `GET /students/:id`, `PUT /students/:id`, `DELETE /students/:id` |

As listagens administrativas retornam `{ data, pagination }`, com `page`, `limit`, `total` e `totalPages`.

## Rastreabilidade dos requisitos

| Requisito do documento | Evidência factual | Status |
| --- | --- | --- |
| Lista, resumo, autor e busca de posts | `PostsListScreen` usa `GET /posts` e `GET /posts/search` | Atendido |
| Leitura completa | `PostDetailsScreen` usa `GET /posts/:id` | Atendido |
| Comentários | Não há entidade, rota ou tela de comentários | Opcional, intencionalmente não implementado |
| Criar e editar posts | `PostFormScreen`; API protege `POST` e `PUT /posts` | Atendido |
| Administrar posts | `AdminPostsScreen`, com edição e confirmação para exclusão | Atendido |
| Professores | Formulário, edição e listagem paginada no mobile; CRUD protegido na API | Atendido |
| Estudantes | Formulário, edição e listagem paginada no mobile; CRUD protegido na API | Atendido |
| Login de professor | `LoginScreen` usa `POST /auth/login` | Atendido |
| Autorização | JWT no servidor e rotas administrativas condicionais nos clientes | Atendido |
| Professor modifica; estudante visualiza | Escritas exigem JWT; leitura de posts é pública; não existe login de estudante | Atendido |
| React Native, hooks e componentes funcionais | `mobile/` usa Expo, hooks e componentes funcionais | Atendido |
| Integração REST | Módulos em `mobile/src/api/` | Atendido |
| README, código, documentação e apresentação | README, esta documentação e guia de apresentação | Atendido, vídeo permanece a gravar |

## Decisões técnicas verificáveis

- Expo no fluxo gerenciado, JavaScript e componentes nativos com `StyleSheet`;
- navegação com `@react-navigation/native` e native stack;
- Context API para sessão, sem Redux ou biblioteca de estado adicional;
- `expo-secure-store` para sessão mobile;
- `EXPO_PUBLIC_API_URL` obrigatória no mobile, sem fallback para `localhost`;
- JWT stateless e bcrypt no back-end;
- paginação por `page` e `limit`, com limite máximo de 100;
- carga de variáveis locais pelo `dotenv` e exigência de `JWT_SECRET` no Docker Compose.

## Desafios e resoluções

- A API original permitia escrita pública de posts. Foram adicionados JWT, middleware e Bearer token nas operações de escrita.
- O professor histórico possuía senha em texto puro. Uma migration nova preserva o registro de desenvolvimento e converte sua senha para hash sem alterar migrations históricas.
- A configuração Docker não encaminhava `JWT_SECRET` e o processo Node não carregava `.env`. O Compose agora exige a variável e a API usa `dotenv/config`.
- Dispositivos físicos não acessam o `localhost` do computador. O mobile exige `EXPO_PUBLIC_API_URL` acessível na rede ou implantada.

## Limitações intencionais

- Comentários são opcionais no enunciado e não foram implementados.
- Há login apenas de professor; estudantes usam a área pública de leitura.
- Não há refresh token, recuperação de senha, cadastro público ou login por provedor externo.

## Estratégia de testes e validação

- Testes de integração Jest/Supertest cobrem login, autorização, posts, professores, estudantes, paginação e erros relevantes.
- `prisma validate` e `prisma migrate status` verificam schema e migrations.
- Vite gera o build do web.
- `expo-doctor` valida o projeto Expo e `expo export --platform android` valida o bundle mobile.

### Roteiro manual do mobile

Quando houver emulador ou dispositivo físico disponível:

1. Configure uma URL de API alcançável em `mobile/.env` e inicie a API.
2. Abra o app, liste e busque posts, e leia um conteúdo completo como visitante.
3. Faça login como professor e confirme a abertura da administração.
4. Crie e edite um post; retorne à administração e confirme a atualização.
5. Exclua um post e cancele/aceite o diálogo nativo de confirmação.
6. Crie, edite, exclua e pagine professores e estudantes.
7. Faça logout, feche e reabra o app para conferir restauração de sessão; use um token inválido/expirado para confirmar o retorno à área pública após 401.

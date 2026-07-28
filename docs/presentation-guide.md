# Guia de apresentação — Tech Challenge Fase 4

Este roteiro apoia uma demonstração gravada de até 15 minutos. O vídeo ainda deve ser gravado pela equipe.

## Roteiro sugerido

| Tempo | Demonstração |
| --- | --- |
| 0:00–1:00 | Contexto: aplicação de blogging, API existente e objetivo de criar o cliente mobile React Native. |
| 1:00–2:30 | Arquitetura: mobile Expo e web consomem API Express/Prisma/PostgreSQL; leitura pública e Bearer JWT nas operações administrativas. |
| 2:30–5:00 | Área pública mobile: lista, busca por palavra-chave e leitura completa de um post. |
| 5:00–6:30 | Login de professor e acesso à área administrativa. Explique que o token fica em SecureStore e a senha não é persistida. |
| 6:30–8:30 | Posts: criar, editar e excluir, destacando a confirmação nativa de exclusão. |
| 8:30–11:30 | Professores: criar, editar, excluir e avançar/voltar na paginação. |
| 11:30–13:30 | Estudantes: repetir o fluxo administrativo e a paginação. |
| 13:30–14:30 | Segurança: middleware JWT, rotas públicas/protegidas, 401 encerrando sessão e ausência de login de estudante. |
| 14:30–15:00 | Documentação, testes, validações e limitações intencionais. |

## Telas e fluxos a apresentar

1. Lista de posts com título, autor, resumo e busca.
2. Detalhe de post como visitante, sem botão de edição.
3. Login de professor.
4. Área administrativa e logout.
5. Criação/edição/exclusão de post.
6. Listagem paginada e formulário de professores.
7. Listagem paginada e formulário de estudantes.

## Pontos técnicos breves

- Expo gerenciado, React Native, hooks e componentes funcionais.
- Context API e `expo-secure-store` para sessão mobile.
- `EXPO_PUBLIC_API_URL` para conectar o dispositivo a uma API acessível.
- API Express + Prisma + PostgreSQL; bcrypt para senhas e JWT para autorização.
- `POST`, `PUT` e `DELETE` de posts, e todo CRUD de professores/estudantes, usam Bearer token.

## Checklist antes de gravar

- [ ] API e PostgreSQL iniciados com `JWT_SECRET` configurado.
- [ ] `mobile/.env` aponta para uma URL acessível pelo emulador ou dispositivo.
- [ ] Há posts, professores e estudantes de demonstração disponíveis.
- [ ] Login de desenvolvimento validado apenas em ambiente local.
- [ ] Fluxo público testado sem sessão.
- [ ] Fluxo administrativo testado com professor autenticado.
- [ ] Paginação e confirmação de exclusão demonstráveis.
- [ ] Vídeo planejado para permanecer dentro de 15 minutos.
- [ ] Nenhum token, senha ou segredo aparece na gravação.

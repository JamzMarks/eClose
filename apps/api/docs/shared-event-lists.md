# Listas de eventos partilhadas (wishlist conjunta)

## Modelo

| Entidade | Tabela | Notas |
|----------|--------|--------|
| Lista | `shared_event_lists` | `id`, `owner_user_id`, `title`, timestamps |
| Membro | `shared_event_list_members` | PK (`list_id`, `user_id`), `role`: `OWNER` \| `EDITOR` \| `VIEWER` |
| Item | `shared_event_list_items` | `id`, `list_id`, `event_id`, `added_by_user_id`, `added_at`; único (`list_id`, `event_id`) |

O dono da lista (`owner_user_id`) tem sempre uma linha em `shared_event_list_members` com `OWNER`.

## Regras

- Criar lista: utilizador autenticado; torna-se owner e membro `OWNER`.
- Ler lista / itens: só membros da lista.
- Adicionar membro: apenas o **owner** da lista; o novo utilizador tem de ser **amigo aceite** do owner (`IFriendshipService.areFriends(ownerId, newUserId)`).
- Remover membro: apenas owner; não pode remover a si próprio (deve apagar a lista).
- Papéis ao adicionar: `EDITOR` ou `VIEWER` (não `OWNER`).
- Adicionar evento à lista: owner ou `EDITOR`; evento tem de existir e estar `PUBLISHED`.
- Remover evento: owner ou `EDITOR`.
- Atualizar título: owner.
- Apagar lista: owner (cascade apaga membros e itens).

## HTTP

Base: `/shared-event-lists` (JWT).

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Body `{ title }` — cria lista |
| GET | `/` | Listas em que o utilizador é membro |
| GET | `/:listId` | Detalhe + membros + contagem de itens |
| PATCH | `/:listId` | Body `{ title }` — owner |
| DELETE | `/:listId` | Owner |
| POST | `/:listId/members` | Body `{ userId, role }` — owner, amigo do owner |
| DELETE | `/:listId/members/:userId` | Owner |
| GET | `/:listId/events` | Eventos na lista (ordenados por `starts_at`) |
| POST | `/:listId/events` | Body `{ eventId }` — owner/editor, evento publicado |
| DELETE | `/:listId/events/:eventId` | Owner/editor |

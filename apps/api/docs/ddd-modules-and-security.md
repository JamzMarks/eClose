# Módulos User, Auth, Venue, Event — DDD e segurança (guards)

Este documento alinha a direcção para a implementação “oficial”: camadas DDD, separação **autenticação** vs **autorização**, e rotas públicas vs privadas sem acoplar domínio a HTTP.

## Visão por módulo (bounded contexts)

| Módulo | Responsabilidade de domínio | Persistência / adapters |
|--------|----------------------------|-------------------------|
| **Auth** | Sessão, emissão/revogação de tokens, OAuth, políticas de conta verificada para certos fluxos, orquestração de onboarding pós-login | `refresh_tokens`, `oauth_accounts`; leitura de utilizador via portas do User |
| **User** | Perfil, preferências, agregado `SocialUser` (regras de idade/consentimento no fluxo quick-signup), tokens push | `users` |
| **Venue** | Ciclo de vida do espaço, regras de visibilidade (`marketplace_listed`, etc.) | `venues` + repositórios |
| **Event** | Evento, estados, organizador (artist), visibilidade pública | `events` + repositórios |

**Auth** não deve conter regras de negócio de Venue/Event; apenas **compor** identidade (quem é o `userId` na sessão) e **políticas transversais** (ex.: “só conta verificada pode X”).

## Camadas sugeridas (por módulo)

```
domain/          # entidades, value objects, políticas puras (sem Nest/TypeORM)
application/     # casos de uso, ports (interfaces)
infrastructure/  # TypeORM, HTTP clients, implementações dos ports
interface/       # Nest: controllers, DTOs de entrada, guards (adaptadores HTTP)
```

### Estrutura actual (Auth, User, Venue, Event)

Ficheiro `*.module.ts` na raiz de cada módulo; camadas:

- **`auth/`** — `application/` (serviço, constantes, tokens, ports, utils); `domain/types/`; `infrastructure/` (persistence, OAuth, passport JWT); `interface/http/` (controller, DTOs, guards de auth).
- **`user/`** — `application/` (serviço, tokens, ports); `domain/entity/` e `domain/types/`; `infrastructure/persistence/`; `interface/http/`.
- **`venue/`** — `application/` (`venue.service`, ports, tokens); `domain/entity/` e `domain/types/`; `infrastructure/` (TypeORM repo, policies, media adapters); `interface/http/` (controller, DTOs).
- **`event/`** — igual em espelho (`event-persistence.module.ts` na raiz para `TypeOrmModule.forFeature` + `EVENT_REPOSITORY`).

JWT Passport: [`jwt.strategy.ts`](../src/auth/infrastructure/passport/jwt.strategy.ts) — importar `JwtValidatedUser` de `@/auth/infrastructure/passport/jwt.strategy`.

**IDs:** novos identificadores de persistência (utilizador em sign-up/OAuth, refresh token row, venue, event, etc.) devem usar o port `ID_GENERATOR` (`UuidIdGenerator` — **UUID v7**, ordenável por tempo) em `@/shared/contracts/id-generator`, registado em `ApplicationCoreModule`. O valor opaco do refresh token (string bearer) continua a ser `randomUUID()` por entropia; a PK da linha em `refresh_tokens` é v7.

## Autenticação vs autorização

- **Autenticação (AUTHN):** “quem és?” — JWT válido, identidade no `request.user`. Hoje: [`PrivateJwtAuthGuard`](src/infrastructure/http/guards/private-jwt-auth.guard.ts) + `@PrivateRoute()`. **Por omissão as rotas são públicas**; marcar só o que exige sessão.
- **Autorização (AUTHZ):** “podes fazer isto neste recurso?” — dono do venue/evento, papel futuro (staff), estado do recurso (rascunho vs publicado).

**Regra:** serviços de domínio / aplicação **não** importam `ExecutionContext` nem `@Injectable()` guards. Recebem `userId` e dados já resolvidos, ou uma **porta** `ICanUserEditEvent(userId, eventId): Promise<boolean>` implementada na infra.

## Guards sem acoplar serviços de domínio

1. **Guard HTTP** (Nest) — só orquestra: lê `req.user`, `req.params`, chama uma **Policy** ou **Authorization port** (interface em `application/ports` ou `auth/application/ports`).
2. **Policy / checker** — classe `@Injectable()` que injeta **repositórios leitura** (ou `QueryHandler`), devolve boolean ou lança `ForbiddenException`.
3. **Domínio** — funções puras quando a regra for local (ex.: “evento cancelado não aceita edição”).

Exemplo de encaixe:

- `EventOwnerPolicy.canEdit(userId, eventId)` usado por `EventOwnerGuard`.
- O `EventService.update` continua a validar invariantes de negócio; o guard evita chamadas óbvias sem permissão (defesa em profundidade).

Evitar: `EventService` injetar `Reflector` ou `JwtService`.

## Tipos de guard (roadmap)

| Guard / metadata | Uso |
|------------------|-----|
| **PrivateJwtAuthGuard** (actual) | JWT obrigatório onde há `@PrivateRoute()` |
| **OptionalAuthGuard** (futuro) | Rotas públicas que enriquecem resposta se houver token (ex.: “já segues este evento?”) |
| **EmailVerifiedGuard** (já existe lógica no Auth para passo `names`) | Rotas estáticas que exigem e-mail verificado |
| **ResourceOwnerGuard** (futuro) | `venue:owner`, `event:organizer` via policy + id na rota |
| **Ability / permission** (futuro) | Matriz fina (ex.: moderador) com CASL ou tabela `role` |

## Conteúdo público (menos fricção na app)

- **GET** de recurso “listável” ou “publicável” (evento/venue em estado publicado) **sem** `@PrivateRoute()`.
- Validação de **visibilidade** dentro do **caso de uso** ou repositório: `findPublicById(id)` vs `findByIdForOwner(id, userId)`.
- Não expor dados pessoais ou métricas sensíveis em endpoints públicos; DTO **público** separado do DTO **autenticado** quando necessário.

## Ordem sugerida de implementação

1. Marcar explicitamente controllers Venue/Event: quais GET são públicos vs privados.
2. Introduzir ports `IVenueAccessPolicy` / `IEventAccessPolicy` (leitura) e guards finos nos PATCH/DELETE.
3. Extrair regras repetidas de “owner” dos services para as policies.
4. Opcional: módulo `authorization/` partilhado que exporta guards + policies (sem importar Entity de Event dentro de User).

Este ficheiro é normativo para evolução; refinar à medida que os casos de uso crescerem.

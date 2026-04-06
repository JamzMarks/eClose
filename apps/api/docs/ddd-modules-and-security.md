# Módulos User, Auth, Venue, Event — DDD e segurança (guards)

Este documento alinha a direcção para a implementação “oficial”: camadas DDD, separação **autenticação** vs **autorização**, e rotas públicas vs privadas sem acoplar domínio a HTTP.

## Visão por módulo (bounded contexts)

| Módulo | Responsabilidade de domínio | Persistência / adapters |
|--------|----------------------------|-------------------------|
| **Auth** | Sessão, emissão/revogação de tokens, OAuth, políticas de conta verificada para certos fluxos, orquestração de onboarding pós-login | `refresh_tokens`, `oauth_accounts`; leitura de utilizador via portas do User |
| **User** | Perfil, preferências, agregado `SocialUser` (regras de idade/consentimento no fluxo quick-signup), tokens push | `users` |
| **Venue** | Ciclo de vida do espaço, regras de visibilidade (`marketplace_listed`, etc.) | `venues` + repositórios |
| **Event** | Evento, estados, organizador (artist), visibilidade pública | `events` + repositórios |
| **SharedEventList** | Wishlists de eventos partilhadas entre amigos (membros com papel; só amigos do dono podem ser adicionados) | `shared_event_lists`, `shared_event_list_members`, `shared_event_list_items` |

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

- **`auth/`** — `application/` (serviço, constantes, tokens, ports, utils); `domain/types/`; `infrastructure/` (persistence, OAuth, passport JWT); `interface/http/` (controller, DTOs, `EmailVerifiedHttpGuard`).
- **`authorization/`** — `authorization.module.ts` (**@Global**), `interface/http/guards/`: `PrivateJwtAuthGuard`, guards de recurso que chamam **ports** `VenueAccessPolicy`, `EventAccessPolicy`, `ArtistAccessPolicy`, `BookingAccessPolicy`. Importa `VenueModule`, `EventModule`, `ArtistModule`, `BookingModule`, `CalendarModule` só para resolver tokens de policy; **não** define entidades.
- **`user/`** — `application/` (serviço, tokens, ports); `domain/entity/` e `domain/types/`; `infrastructure/persistence/`; `interface/http/`.
- **`venue/`** — `application/` (`venue.service`, ports, tokens); `domain/entity/` e `domain/types/`; `infrastructure/` (TypeORM repo, policies, media adapters); `interface/http/` (controller, DTOs).
- **`event/`** — igual em espelho (`event-persistence.module.ts` na raiz para `TypeOrmModule.forFeature` + `EVENT_REPOSITORY`).

JWT Passport: [`jwt.strategy.ts`](../src/auth/infrastructure/passport/jwt.strategy.ts) — importar `JwtValidatedUser` de `@/auth/infrastructure/passport/jwt.strategy`.

**IDs:** novos identificadores de persistência (utilizador em sign-up/OAuth, refresh token row, venue, event, etc.) devem usar o port `ID_GENERATOR` (`UuidIdGenerator` — **UUID v7**, ordenável por tempo) em `@/shared/contracts/id-generator`, registado em `ApplicationCoreModule`. O valor opaco do refresh token (string bearer) continua a ser `randomUUID()` por entropia; a PK da linha em `refresh_tokens` é v7.

## Autenticação vs autorização

- **Autenticação (AUTHN):** “quem és?” — JWT válido, identidade no `request.user`. Hoje: [`PrivateJwtAuthGuard`](../src/authorization/interface/http/guards/private-jwt-auth.guard.ts) (registado como `APP_GUARD` em [`AuthorizationModule`](../src/authorization/authorization.module.ts)) + `@PrivateRoute()`. **Por omissão as rotas são públicas**; marcar só o que exige sessão.
- **Autorização (AUTHZ):** “podes fazer isto neste recurso?” — dono do venue/evento, papel futuro (staff), estado do recurso (rascunho vs publicado).

**Regra:** serviços de domínio / aplicação **não** importam `ExecutionContext` nem `@Injectable()` guards. Recebem `userId` e dados já resolvidos, ou uma **porta** (`VenueAccessPolicyPort`, `EventAccessPolicyPort`, …) implementada na infra.

## Padrão Guard → Policy (HTTP)

| Guard (em `authorization/interface/http/guards/`) | Port / token | Uso típico |
|---------------------------------------------------|--------------|------------|
| `VenueCreateBodyOwnerHttpGuard` | `VENUE_ACCESS_POLICY` | `POST /venues` — valida cláusula `ownerUserId` no body |
| `VenueResourceOwnerHttpGuard` | `VENUE_ACCESS_POLICY` | `PATCH /venues/:id/...` com id na rota |
| `EventOrganizerBodyHttpGuard` | `EVENT_ACCESS_POLICY` | `POST /events` — `organizerArtistId` pertence ao actor |
| `EventResourceOrganizerHttpGuard` | `EVENT_ACCESS_POLICY` | `GET/PATCH /events/:id/...` organizador |
| `ArtistCreateBodyOwnerHttpGuard` | `ARTIST_ACCESS_POLICY` | `POST /artists` |
| `ArtistResourceOwnerHttpGuard` | `ARTIST_ACCESS_POLICY` | mutações com `:id` |
| `BookingInquiryRequesterHttpGuard` | `BOOKING_ACCESS_POLICY` | lado requester da inquiry |
| `BookingInquiryCounterpartHttpGuard` | `BOOKING_ACCESS_POLICY` | lado counterpart |
| `CalendarArtistOwnerHttpGuard` | `ARTIST_ACCESS_POLICY` | rotas calendário por `artistId` |
| `CalendarVenueOwnerHttpGuard` | `VENUE_ACCESS_POLICY` | rotas calendário por `venueId` |
| `SelfUserHttpGuard` | — | `params.id === user.id` (dados pessoais) |

Implementações: `*AccessPolicyImpl` em cada bounded context (`venue/infrastructure`, `event/infrastructure`, etc.). O `BookingModule` **exporta** `BOOKING_ACCESS_POLICY` para o `AuthorizationModule`.

## Auditoria de rotas (público vs privado)

### Venue (`/venues`)

| Método | Rota | Público? | Protecção |
|--------|------|----------|-----------|
| GET | `/venues` | Sim | `VenueService.listPublicMarketplace()` — só `isActive` + `marketplaceListed` (repositório) |
| GET | `/venues/:id` | Sim | `getPublicById` — mesmos invariantes; resposta **pública** sem CNPJ nem ids de anexos; inclui `isVerifiedL2` |
| GET | `/venues/:id/manage` | Não | `@PrivateRoute()` + `VenueResourceOwnerHttpGuard` — estado completo de verificação para o dono |
| POST | `/venues` | Não | `@PrivateRoute()` + `VenueCreateBodyOwnerHttpGuard` |
| POST | `/venues/:id/trust-verification` | Não | `@PrivateRoute()` + `VenueResourceOwnerHttpGuard` — CNPJ + dois `media_asset_id` (anexos `listable: false`) |
| PATCH | `/venues/:id/primary-media` | Não | `@PrivateRoute()` + `VenueResourceOwnerHttpGuard` |

### Verificação de venue (nível 2 — “semi confiável”)

- **Dono:** regista dois ficheiros como `POST /media/assets` com `parentType: VENUE`, `parentId` do espaço, `listable: false`, `kind` `IMAGE` ou `DOCUMENT` (PDF/JPEG/PNG/WebP), depois `POST /venues/:id/trust-verification` com `cnpj` + ids dos assets. O estado passa a `pending_review`.
- **Dados CNPJ/CEP (porta + adapter):** o caso de uso usa só `IBrazilianVenueTrustDataPort` (`shared/application/ports`) e snapshots de domínio (`BrazilianPostalCodeLocationSnapshot`, `CompanyRegistryTrustSnapshot` em `shared/domain/br`). A implementação actual é `BrasilApiTrustDataAdapter`, que chama [BrasilAPI](https://brasilapi.com.br) e mapeia o JSON wire → domínio em `brasil-api-wire-to-domain.mapper.ts`. Para trocar de fornecedor, implementar a mesma porta + novo mapper wire → snapshots, e registar o adapter em `VenueModule`. Variáveis do adapter actual: `BRASILAPI_BASE_URL`, `BRASILAPI_TIMEOUT_MS` (opcional).
- **Público:** `GET /venues/...` e marketplace só expõem `isVerifiedL2`; anexos não entram em `GET /media/parents/VENUE/...` (filtro `listable`).
- **Operações / revisão (MVP):** `PATCH /internal/venue-trust/:venueId` com header `x-admin-api-key` igual a `ADMIN_API_KEY` no ambiente; body `{ "status": "verified_l2" | "rejected" }`. Sem `ADMIN_API_KEY` configurada a rota responde 401.
- **Alternativa SQL (revisão manual):** atualizar `venues.verification_status` para `verified_l2` ou `rejected` (e `updated_at`). O campo `isVerifiedL2` na API é derivado de `verification_status === 'verified_l2'` ao hidratar o agregado.

### Event (`/events`)

| Método | Rota | Público? | Protecção |
|--------|------|----------|-----------|
| GET | `/events` | Sim | `listPublishedPublic` / `listPublishedFiltered` — só publicados |
| GET | `/events/:id` | Sim | `getPublicById` — só `EventStatus.PUBLISHED` |
| GET | `/events/:id/organizer` | Não | `@PrivateRoute()` + `EventResourceOrganizerHttpGuard` |
| POST | `/events` | Não | `@PrivateRoute()` + `EventOrganizerBodyHttpGuard` |
| PATCH | `/events/:id/primary-media` | Não | `@PrivateRoute()` + `EventResourceOrganizerHttpGuard` |

### Booking (`/booking`)

| Âmbito | Protecção |
|--------|-----------|
| Todo o controller | `@PrivateRoute()` a nível de classe |
| Mutações por `inquiries/:id` | `BookingInquiryRequesterHttpGuard` ou `BookingInquiryCounterpartHttpGuard` conforme o papel |

## Guards sem acoplar serviços de domínio

1. **Guard HTTP** (Nest) — só orquestra: lê `req.user`, `req.params`, chama uma **Policy** ou **Authorization port** (interface em `application/ports` do agregado).
2. **Policy / checker** — classe `@Injectable()` que injeta **repositórios leitura** (ou query), devolve boolean ou lança erro de domínio mapeado para HTTP no guard.
3. **Domínio** — funções puras quando a regra for local.

Evitar: `EventService` injetar `Reflector` ou `JwtService`.

## Media — armazenamento de objectos (upload)

O caso de uso `MediaService.requestSignedUploadIntent` depende só de **`IMediaObjectStoragePort`** (`media/application/ports/media-object-storage.port.ts`), com tipos estáveis (`MediaObjectStorageUploadIntentRequest` / `MediaObjectStorageUploadIntent`). Implementações em `media/infrastructure/object-storage/`:

| Adapter | `MEDIA_OBJECT_STORAGE_ADAPTER` | Notas |
|---------|-------------------------------|--------|
| `EnvPrefixObjectStorageAdapter` | `env` (omissão) | Prefixos `MEDIA_UPLOAD_BASE_URL` + `MEDIA_CDN_PUBLIC_BASE_URL` (MVP sem SDK). |
| `LocalFilesystemObjectStorageAdapter` | `local` | Disco + `POST /media/local-write` (JWT, multipart `file`) e `GET /media/local-public`; `MEDIA_PUBLIC_APP_URL`, `MEDIA_LOCAL_ROOT`, opcional `MEDIA_LOCAL_MAX_UPLOAD_BYTES`. |
| `S3PresignedObjectStorageAdapter` | `s3` | PUT presigned (`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`); `MEDIA_S3_BUCKET`, `AWS_REGION`, credenciais IAM/env. |
| `AzureBlobSasObjectStorageAdapter` | `azure` | SAS para upload (`@azure/storage-blob`); `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_STORAGE_ACCOUNT_KEY`, `MEDIA_AZURE_CONTAINER`. |

Trocar de cloud = novo adapter + `createMediaObjectStorageAdapter()` em `media-object-storage.adapter.factory.ts` (ou registo Nest equivalente). A resposta HTTP de `POST /media/upload-intent` inclui `httpMethod`, `headers` e, no modo local, `multipartFieldName` quando o upload é `multipart/form-data`.

## Verificação de e-mail (API)

- `POST /auth/email-verification/send` — `@PrivateRoute()`; emite JWT de verificação (expiração `JWT_EMAIL_VERIFY_EXPIRES`); em desenvolvimento o token é registado em log (canal de e-mail em backlog).
- `POST /auth/email-verification/confirm` — público; body `{ token }`; valida JWT com `purpose: email_verify` e chama `UserService.markEmailVerified`.

## `AppModule`

Importar `AuthorizationModule` (por exemplo no fim da lista `imports`) para registar o `APP_GUARD` e disponibilizar os guards HTTP globais.

## Backlog (auth e produto)

| Item | Notas |
|------|--------|
| **E-mail transaccional** | Enviar link com token em produção (Notification / provider externo); retirar dependência de log em dev. |
| **Reset / MFA / troca de e-mail** | Interfaces já em `IAuthService`; implementações continuam `501` até priorização. |
| **`OptionalAuthGuard`** | Rotas públicas que enriquecem a resposta se existir JWT válido. |
| **Termos e privacidade no `SignUpDto`** | Campos `termsAcceptedAt` / `privacyAcceptedAt` já existem na entidade User; falta validação e gravação no sign-up HTTP. |
| **Abilities / CASL / papéis staff** | Matriz fina para moderadores, etc. |

Este ficheiro é normativo para evolução; refinar à medida que os casos de uso crescerem.

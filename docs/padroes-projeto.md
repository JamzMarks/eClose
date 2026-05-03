# Padrões do projeto (referência)

Este documento padroniza **organização de pastas**, **types**, e **imports** para manter consistência entre requests.

## Estrutura (mobile)

Base: `apps/mobile/src/`

- **`features/`**: módulos por domínio/caso de uso (preferível para “produto”)
  - Ex.: `features/explore/`, `features/auth/`
  - Dentro de uma feature, pode haver: `components/`, `hooks/`, `services/`, `types.ts`, `utils.ts`, `index.ts`
- **`components/`**: componentes compartilhados que não “pertencem” a uma feature
  - **`components/ui/`**: design system / UI reusável (Button, Input, Sheet…)
  - **`components/shared/`**: componentes cross-feature (ex.: themed, layout wrappers)
  - **`components/tabs/`**: componentes de telas/abas (quando fizer sentido manter “por navegação”)
- **`services/`**: integração com APIs + mappers + mocks
  - **`services/<dominio>/`**: serviços específicos (`explore/`, `auth/`, `media/`…)
  - **`services/types/`**: DTOs/contratos compartilhados entre serviços
- **`lib/`**: código “infra” (maps, storage, permissions…)
- **`utils/`**: helpers puros (sem UI) e utilitários genéricos
- **`contexts/`**: providers/contexts globais
- **`types/`**: tipos globais do app (ex.: `*.d.ts`, tipos transversais)

## Aliases de import (obrigatório)

No `apps/mobile`:

- **`@/…`** → `src/…`
- **`@app/…`** → `app/…`
- **`@features/…`** → `src/features/…`
- **`@ui/…`** → `src/components/ui/…`
- **`@components/…`** → `src/components/…`
- **`@services/…`** → `src/services/…`
- **`@lib/…`** → `src/lib/…`
- **`@utils/…`** → `src/utils/…`
- **`@types/…`** → `src/types/…`
- **`@contexts/…`** → `src/contexts/…`

Regras:

- **Preferir alias** ao invés de `../../..`
- **Não criar alias novo** sem registrar aqui + `tsconfig` + `babel.config.js`

## Convenções de types

### Nomes e arquivos

- **`*.types.ts`**: tipos/contratos/exportações de tipos do módulo
  - Ex.: `explore-map-data.types.ts`, `venue.types.ts`
- **`*.d.ts`**: declarações globais (modules/assets)
  - Ex.: `src/types/legal-html.d.ts`
- **Sufixos**
  - **`Dto`**: contrato vindo da API (ex.: `VenueDto`)
  - **`Input` / `Request`**: payload de envio (ex.: `CreateVenueRequest`)
  - **`Response`**: payload de retorno (quando não for só `Dto`)
  - **`Model`** (opcional): tipo “normalizado” para UI/app quando diverge do DTO

### Onde colocar

- **Feature-specific**: `src/features/<feature>/.../*.types.ts`
- **Serviços/API (DTOs compartilhados)**: `src/services/types/*.types.ts`
- **Infra/biblioteca**: `src/lib/<modulo>/types.ts` (quando for parte do contrato do `lib`)
- **Global**: `src/types/*.d.ts` (evitar jogar tudo aqui; preferir feature/services)

### Regras de desenho

- **Sem lógica em arquivo de types** (exceto `const enum`/literal helpers muito pequenos)
- **Preferir unions literais** quando houver conjunto fixo (`"pending" | "verified" | ...`)
- **Evitar `any`**; quando inevitável, preferir `unknown` + narrowing

## Organização por feature (modelo recomendado)

Exemplo (referência):

```
src/features/explore/
  components/
  hooks/
  services/
  explore.types.ts
  explore.utils.ts
  index.ts
```

## Barrels (`index.ts`)

- **Permitir** `index.ts` para “public API” do módulo (re-export do que é público)
- **Evitar** re-export profundo e circular (quando começar a ficar confuso, remover barrel)

## Mocks

- **Mocks de serviço** em `src/services/<dominio>/mock/`
- Tipos do mock devem referenciar os tipos reais (não duplicar shape)


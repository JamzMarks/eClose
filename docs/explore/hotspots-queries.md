# Hotspots — consultas otimizadas (mapa + sheet)

Este documento descreve um padrão de requests que minimiza payload e custo de query quando o mapa tem **pins (venues)** e **hotspots (áreas)**.

## Objetivo
- **Mapa rápido**: carregar/atualizar pins conforme o viewport muda (pan/zoom), com payload mínimo.
- **Clique no hotspot**: abrir o modal (sheet) com **venues dentro do raio do hotspot**, com paginação e ordenação.

## Princípio: 2 níveis de dados
- **Nível 1 (Mapa / Pins)**: “dados mínimos” para renderizar no mapa.
- **Nível 2 (Lista / Cards)**: “dados ricos” para UI de lista (card), retornados apenas quando o usuário pede.

## Nível 1 — pins por viewport (bounding box)
### Request
`GET /explore/map/venues`

Query (exemplo):
- `minLat,maxLat,minLng,maxLng` (bbox do viewport)
- `kinds=bar,restaurant,...` (opcional)
- `cursor` + `limit` (pagina cursor)
- `fields=pin` (para payload mínimo)

### Response (shape sugerido)
Retornar apenas o que o mapa precisa:
- `id`
- `title`
- `subtitle` (opcional)
- `lat,lng`
- `kind`
- `primaryMediaUrl` (opcional)

Exemplo:
```json
{
  "items": [
    { "id": "v1", "title": "Bar X", "lat": -23.51, "lng": -46.87, "kind": "bar", "primaryMediaUrl": null }
  ],
  "nextCursor": "..."
}
```

### Otimizações recomendadas
- **Debounce + bbox tolerance**: só refazer request quando o bbox mudar “de verdade”.
- **Cache por tile/bbox normalizado**: chave do cache = \(bbox arredondado + kinds + page\), TTL curto (ex.: 30–120s).
- **Servidor**: preferir paginação por cursor (evita `OFFSET` caro).

## Nível 2 — clique no hotspot (consulta por círculo)
Para hotspots, a query ideal é por **círculo**: centro (lat/lng) + raio.

### Request (genérico “near”)
`GET /explore/venues/near`

Query (exemplo):
- `lat=-23.5114`
- `lng=-46.8769`
- `radiusM=750`
- `kinds=bar,restaurant` (opcional)
- `cursor` + `limit`
- `sort=distance|popularity|openNow`
- `fields=card` (payload completo para lista)

### Response (shape sugerido)
Retornar dados de card (mais ricos que o pin):
- tudo do pin +
- `address` (linha, bairro, cidade)
- `distanceM` (opcional, se o servidor calcular)
- `isOpenNow` (opcional)
- `tags` (opcional)

Exemplo:
```json
{
  "items": [
    {
      "id": "v1",
      "title": "Bar X",
      "lat": -23.51,
      "lng": -46.87,
      "kind": "bar",
      "distanceM": 420,
      "address": { "line1": "Av ...", "city": "Barueri", "region": "SP" }
    }
  ],
  "nextCursor": "..."
}
```

### Por que círculo (e não bbox)?
- Hotspot é “raio” por natureza.
- Evita **overfetch** do quadrado envolvente do bbox.
- Permite ordenação natural por **distância**.

## Estratégia de implementação (cliente)
### Melhor caminho (progressivo)
1. **Carregar pins por viewport** (bbox).
2. **Hotspot click**:
   - **MVP**: filtrar localmente os pins já carregados (se o hotspot estiver no viewport).
   - **Produção**: disparar request `venues/near` para garantir completude (mesmo fora do conjunto atual de pins) + paginação.

### Combinação recomendada
- Mapa: `fields=pin`
- Sheet de hotspot: `fields=card` + `sort=distance`

## Otimização no banco (servidor)
Escolha depende do stack, mas o padrão é “índice geoespacial + query por distância”.

### Postgres + PostGIS (recomendado)
- Coluna `geog` (geography) ou `geom` (geometry) com índice `GIST`.
- Query típica:
  - `ST_DWithin(geog, ST_MakePoint(lng, lat)::geography, radiusM)`
  - Ordenar por `ST_Distance(...)` quando necessário.

### MongoDB
- Índice `2dsphere`.
- Query com `$near` e `maxDistance`.

## Observabilidade e limites anti-spam
- **Limite de requests** no pan (debounce/throttle).
- **Rate limit** por IP/usuário no `venues/near`.
- **Payload controlado** com `fields`.


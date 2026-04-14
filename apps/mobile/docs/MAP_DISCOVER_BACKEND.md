# API de mapa / descoberta (bbox e pins)

Este documento descreve o que o **cliente mobile** (`MapViewportProvider`, `src/lib/maps/`) espera do **backend** para alimentar o mapa de exploração (eventos, espaços e, no futuro, outros pontos).

Referência de código no app:

- Tipos: `src/lib/maps/types.ts`
- Geometria e query: `src/lib/maps/map-geometry.ts` (`boundingBoxToQueryParams`, `regionToBoundingBox`, …)
- Estado do viewport: `src/lib/maps/map-provider.tsx`

---

## 1. Modelo geográfico no cliente

- O mapa expõe uma **`MapRegion`**: centro (`latitude`, `longitude`) + extensão em graus (`latitudeDelta`, `longitudeDelta`), compatível com `react-native-maps`.
- Isso converte-se numa **`BoundingBox`** retangular em WGS84:

  - `minLatitude`, `maxLatitude`
  - `minLongitude`, `maxLongitude`

- **Limitação assumida no MVP:** o viewport **não cruza o meridiano 180°**. Regiões que o cruzem exigem contrato à parte (polígonos ou normalização).

---

## 2. O que a API deve aceitar

### 2.1 Filtro por retângulo (lista / pesquisa no mapa)

Para devolver itens **cuja localização caia dentro** da área visível:

| Campo (sugestão) | Tipo   | Significado        |
|------------------|--------|--------------------|
| `minLat`         | number | Limite sul         |
| `maxLat`         | number | Limite norte       |
| `minLng`         | number | Limite oeste       |
| `maxLng`         | number | Limite leste       |

O cliente pode gerar estes nomes a partir de `boundingBoxToQueryParams()` (ajusta os nomes no adaptador HTTP se a API usar outros, ex. `south`, `north`).

**Comportamento esperado:**

- Filtrar entidades com coordenada **dentro** do retângulo (inclusivo ou exclusivo dos bordos — documentar no contrato OpenAPI).
- Se não forem enviados, a API pode aplicar um limite de segurança (ex. raio máximo, ou lista global paginada) para evitar full table scan.

### 2.2 Resposta com coordenadas para pins

Cada item devolvido para o mapa deve incluir pelo menos:

| Campo        | Tipo   | Obrigatório |
|--------------|--------|-------------|
| `id`         | string | sim         |
| `latitude`   | number | sim         |
| `longitude`  | number | sim         |
| `kind`       | enum   | opcional    | `event`, `venue`, `artist`, … (alinhar com `MapPin` em `types.ts`) |

Tipos de domínio existentes no cliente: `EventDto`, `MarketplaceVenueCardDto`, etc. — basta garantir **geo** explícita na resposta de listagem “mapa” ou enriquecer os DTOs usados no discover.

---

## 3. Endpoints (contrato lógico)

Nomes de rota são exemplos; o importante é o **contrato de dados**.

1. **Listagem geo no viewport** (para o tab Mapa ao mover/zoom ou debounce):
   - `GET` com query `minLat`, `maxLat`, `minLng`, `maxLng` **ou**
   - `POST` com corpo JSON no formato de `boundingBoxToJsonBody()` em `map-geometry.ts`.

2. **Paginação / limite**
   - `limit`, `cursor` / `offset` — recomendado para não devolver milhares de pins numa área grande.

3. **Ordenação (opcional)**
   - Por relevância, distância ao centro do bbox, ou data do evento.

4. **Autenticação**
   - Definir se o mapa público é anónimo ou requer sessão (o cliente já trata tabs com/sem login noutros sítios).

---

## 4. Agregação e performance

- **Clustering:** pode ser feito no cliente ou no servidor; se o servidor devolver clusters, o contrato deve incluir `count`, `bbox` ou centro do cluster + zoom sugerido.
- **Debounce:** o cliente deve evitar pedidos a cada frame; combinar com **limiar mínimo** de mudança de bbox (`boundingBoxesAlmostEqual` no cliente) e throttle.
- **Cache HTTP / ETag:** útil para a mesma região repetida.

---

## 5. Relação com `expo-location`

- A região **inicial** pode vir do GPS (`useSuggestedExploreRegion`): mesmo bbox inicial até o utilizador mover o mapa.
- Permissões de localização são independentes deste contrato; a API só recebe números de bbox ou coordenadas.

---

## 6. Checklist rápido para o backend

- [ ] Aceitar filtro retangular WGS84 (`minLat` / `maxLat` / `minLng` / `maxLng` ou equivalente documentado).
- [ ] Devolver entidades com `latitude` / `longitude` (+ `id`) para renderizar pins.
- [ ] Limitar tamanho da resposta (paginação ou máximo de pontos por pedido).
- [ ] Documentar inclusão nos bordos do retângulo e comportamento quando bbox é inválido (ex. `minLat > maxLat`).
- [ ] (Opcional) Endpoint ou query param separado para **apenas eventos** vs **apenas venues** no mapa, se o produto o exigir.

Quando o contrato real estiver no OpenAPI, alinhar os nomes dos query params em `boundingBoxToQueryParams` / cliente HTTP.

/**
 * Quando `true`, os services devolvem dados estáticos definidos nos ficheiros `*.local-data.ts`
 * junto a cada service. A UI continua a chamar os services normalmente.
 *
 * Defina como `false` para voltar a usar HTTP (chamadas reais no código de cada service).
 */
export const USE_LOCAL_SERVICE_DATA = true;

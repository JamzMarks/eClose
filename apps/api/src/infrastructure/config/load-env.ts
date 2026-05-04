import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

const cwd = process.cwd();

function loadFile(relPath: string, override: boolean): void {
  const path = resolve(cwd, relPath);
  if (existsSync(path)) {
    config({ path, override });
  }
}

/**
 * Ordem de carregamento (últimos sobrescrevem chaves anteriores quando `override`):
 * 1. `.env` — base partilhada (opcional)
 * 2. `.env.{APP_ENV}` — APP_ENV ∈ development | uat | production (default: development)
 * 3. `.env.local` — segredos locais / overrides (não commitar)
 *
 * `APP_ENV` pode vir do sistema (scripts npm, CI, container) antes de carregar `.env`;
 * nesse caso o valor externo não é substituído pelo primeiro `config()` (dotenv não
 * sobrescreve variáveis já definidas, salvo `override`).
 */
export function loadAppEnv(): void {
  loadFile(".env", false);
  const appEnv = process.env.APP_ENV ?? "development";
  loadFile(`.env.${appEnv}`, true);
  loadFile(".env.local", true);
}

import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, (g) => `_${g.toLowerCase()}`)
    .replace(/^_/, "");
}

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    const base = customName || toSnakeCase(propertyName);
    return embeddedPrefixes.concat(base).join("_");
  }
}

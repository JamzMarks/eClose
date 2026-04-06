/** Apenas dígitos. */
export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

/** CEP BR: 8 dígitos ou null se inválido. */
export function normalizeBrazilianCepDigits(input: string | null | undefined): string | null {
  if (input == null || !String(input).trim()) return null;
  const d = digitsOnly(String(input));
  return d.length === 8 ? d : null;
}

export function normalizeUf(uf: string | null | undefined): string {
  return (uf ?? "").trim().toUpperCase();
}

/** Comparação tolerante: maiúsculas, sem acentos, espaços colapsados. */
export function normalizeCityForCompare(city: string | null | undefined): string {
  return (city ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

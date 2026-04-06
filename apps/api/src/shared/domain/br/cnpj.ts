/** Apenas dígitos, 14 caracteres. */
export function normalizeBrazilianCnpj(input: string): string {
  return input.replace(/\D/g, "");
}

const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function checkDigit(base: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += parseInt(base[i]!, 10) * weights[i]!;
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

/** Valida dígitos verificadores do CNPJ (formato já normalizado). */
export function isValidBrazilianCnpjDigits(digits: string): boolean {
  if (digits.length !== 14) return false;
  if (!/^\d{14}$/.test(digits)) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  const d1 = checkDigit(digits.slice(0, 12), WEIGHTS_1);
  if (d1 !== parseInt(digits[12]!, 10)) return false;
  const d2 = checkDigit(digits.slice(0, 13), WEIGHTS_2);
  return d2 === parseInt(digits[13]!, 10);
}

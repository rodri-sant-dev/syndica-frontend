export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;

  // Rejeita sequências repetidas (111.111.111-11, 000.000.000-00 etc)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  const calcCheckDigit = (sliceLength: number): number => {
    let sum = 0;
    let weight = sliceLength + 1;
    for (let i = 0; i < sliceLength; i++) {
      sum += digits[i] * weight;
      weight--;
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstCheckDigit = calcCheckDigit(9);
  if (firstCheckDigit !== digits[9]) return false;

  const secondCheckDigit = calcCheckDigit(10);
  if (secondCheckDigit !== digits[10]) return false;

  return true;
}

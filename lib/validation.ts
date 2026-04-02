/** Indian mobile: 10 digits, typically starts 6–9 */
export function isValidIndianMobile(digits: string): boolean {
  return /^[6-9]\d{9}$/.test(digits);
}

export function normalizeIndianMobile(input: string): string {
  return input.replace(/\D/g, '').slice(-10);
}

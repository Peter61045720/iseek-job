export function generateSearchKeywords(input: string): string[] {
  return Array.from({ length: input.length }, (_, i) => input.substring(0, i + 1).toLowerCase());
}

export type FlagSize = "w40" | "w80" | "w160";

export function getFlagUrl(code: string, size: FlagSize = "w80"): string {
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
}

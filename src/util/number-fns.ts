export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (abs >= 1_000_000)     return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000)         return `${sign}${(abs / 1_000).toFixed(1).replace(/\.0$/, "")}K`;

  return `${sign}${abs}`;
}
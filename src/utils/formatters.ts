export function formatGameDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatGameStatus(status: string): string {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatScore(score: number | null): string {
  return score === null ? '-' : String(score);
}

export function formatDecimal(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
}

export function formatPercentage(value: number): string {
  const normalizedValue = value > 1 ? value / 100 : value;

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(normalizedValue);
}

export function formatStatValue(value: number | null | undefined): string {
  return typeof value === 'number' && Number.isFinite(value) ? formatDecimal(value) : '-';
}

export function bySeconds(i: number): number {
  return i * 1000;
}

export function byMinutes(i: number): number {
  return bySeconds(60) * i;
}

export function byHours(i: number): number {
  return byMinutes(60) * i;
}

export function byDays(i: number): number {
  return byHours(24) * i;
}

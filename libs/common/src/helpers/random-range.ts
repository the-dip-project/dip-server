export function randomRange(min: number, max: number, isInt = false): number {
  const random = Math.random() * (max - min) + min;

  return isInt ? ~~random : random;
}

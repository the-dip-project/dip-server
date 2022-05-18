import { randomRange } from './random-range';

const defaultCharset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_';

export function randomString(
  length: number,
  charset: string = defaultCharset,
): string {
  const result = [];

  for (let i = 0; i < length; i++)
    result.push(charset.charAt(randomRange(0, charset.length)));

  return result.join('');
}

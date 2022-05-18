import { createHash, createHmac } from 'crypto';

export type GenerateAnswerOptions = {
  hashPassword: boolean;
};

export function generateAnswer(
  question,
  password,
  options: GenerateAnswerOptions = { hashPassword: false },
): string {
  const { hashPassword } = options;

  const hashedPassword = hashPassword
    ? createHash('sha256').update(password).digest('hex')
    : password;

  return createHmac('sha256', question).update(hashedPassword).digest('hex');
}

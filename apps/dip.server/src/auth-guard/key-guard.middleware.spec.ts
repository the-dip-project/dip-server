import { KeyGuardMiddleware } from './key-guard.middleware';

describe('KeyGuardMiddleware', () => {
  it('should be defined', () => {
    expect(new KeyGuardMiddleware()).toBeDefined();
  });
});

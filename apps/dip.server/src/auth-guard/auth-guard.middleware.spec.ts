import { UserEntity } from '@/common/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthGuardMiddleware } from './auth-guard.middleware';

describe('AuthGuardMiddleware', () => {
  let middleware: AuthGuardMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuardMiddleware,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory() {
            return jest.fn(() => ({
              findOne: jest.fn((entity) => entity),
            }));
          },
        },
      ],
    }).compile();

    middleware = module.get<AuthGuardMiddleware>(AuthGuardMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});

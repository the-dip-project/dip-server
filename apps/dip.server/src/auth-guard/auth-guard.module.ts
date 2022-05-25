import { UserEntity } from '@/common/entities';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainController } from '../domain/domain.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthGuardMiddleware } from './auth-guard.middleware';
import { KeyGuardMiddleware } from './key-guard.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule, UserModule],
  providers: [AuthGuardMiddleware, KeyGuardMiddleware, UserService],
})
export class AuthGuardModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuardMiddleware)
      .exclude({ path: '/api/user/login', method: RequestMethod.ALL })
      .forRoutes(
        { path: '/api/user', method: RequestMethod.ALL },
        { path: '/api/user/*', method: RequestMethod.ALL },
      );

    consumer
      .apply(KeyGuardMiddleware, AuthGuardMiddleware)
      .forRoutes(DomainController);
  }
}

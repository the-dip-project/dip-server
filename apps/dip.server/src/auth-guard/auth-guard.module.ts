import { UserEntity } from '@/common/entities';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainController } from '../domain/domain.controller';
import { AuthGuardMiddleware } from './auth-guard.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  providers: [AuthGuardMiddleware],
  exports: [AuthGuardMiddleware],
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

    consumer.apply(AuthGuardMiddleware).forRoutes(DomainController);
  }
}

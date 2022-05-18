import { UserEntity } from '@/common/entities';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuardMiddleware } from './auth-guard.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  providers: [AuthGuardMiddleware],
  exports: [AuthGuardMiddleware],
})
export class AuthGuardModule {}

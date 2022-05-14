import { LogEntity } from '@/common/entities/log.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbLoggerService } from './db-logger.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [DbLoggerService],
  exports: [DbLoggerService],
})
export class DbLoggerModule {}

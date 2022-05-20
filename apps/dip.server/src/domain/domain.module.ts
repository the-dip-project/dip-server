import { DomainEntity, RecordEntity } from '@/common/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { RecordService } from './record.service';

@Module({
  imports: [TypeOrmModule.forFeature([DomainEntity, RecordEntity])],
  controllers: [DomainController],
  providers: [DomainService, RecordService],
})
export class DomainModule {}

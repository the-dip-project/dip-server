import { Repository } from 'typeorm';

import { DomainEntity, RecordEntity } from '@/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DomainService {
  public constructor(
    @InjectRepository(DomainEntity)
    private readonly domainRepository: Repository<DomainEntity>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
  ) {}

  public async getAllDomainsByUserId(userId: number): Promise<DomainEntity[]> {
    return this.domainRepository.find({
      where: { ownerId: userId },
    });
  }

  public async getRecordsCountByDomainId(domainId: number): Promise<number> {
    return this.recordRepository.count({
      domainId,
    });
  }
}

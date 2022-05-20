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

  public async getDomainByName(domain: string): Promise<DomainEntity> {
    return this.domainRepository.findOne({
      where: { domain },
    });
  }

  public async registerDomain(
    userId: number,
    domain: string,
  ): Promise<DomainEntity> {
    const newDomain = this.domainRepository.create({
      domain,
      ownerId: userId,
    });

    return (await this.domainRepository.insert(newDomain))
      .generatedMaps[0] as DomainEntity;
  }
}

import { Repository } from 'typeorm';

import { DomainEntity } from '@/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DomainService {
  public constructor(
    @InjectRepository(DomainEntity)
    private readonly domainRepository: Repository<DomainEntity>,
  ) {}

  public async getAllDomainsByUserId(userId: number): Promise<DomainEntity[]> {
    return this.domainRepository.find({
      where: { ownerId: userId },
    });
  }

  public async getDomainById(domainId: number): Promise<DomainEntity> {
    return this.domainRepository.findOne({
      where: { id: domainId },
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

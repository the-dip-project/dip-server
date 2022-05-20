import { RecordEntity } from '@/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  public constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
  ) {}

  public async getRecordsCountByDomainId(domainId: number): Promise<number> {
    return this.recordRepository.count({
      domainId,
    });
  }

  public async getRecordsByDomainId(domainId: number): Promise<RecordEntity[]> {
    return this.recordRepository.find({
      domainId,
    });
  }
}

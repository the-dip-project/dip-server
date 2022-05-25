import { Repository } from 'typeorm';

import { RecordEntity } from '@/common/entities';
import { NOT_UPDATEABLE_COLUMNS } from '@/common/entities/record.entity';
import { UpdateRecordBodyDTO } from '@/common/models/dto/domain/update-record.body.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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

  public async getRecordById(recordId: number): Promise<RecordEntity> {
    return this.recordRepository.findOne({ id: recordId });
  }

  public async updateRecord(
    record: RecordEntity,
    partialRecord: UpdateRecordBodyDTO,
  ): Promise<RecordEntity> {
    const merged = { ...record, ...partialRecord };

    for (const field of NOT_UPDATEABLE_COLUMNS) delete merged[field];

    await this.recordRepository.update({ id: record.id }, merged);

    return merged;
  }
}

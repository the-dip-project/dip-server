import { DomainEntity, RecordEntity, UserEntity } from '@/common/entities';
import { HttpErrorMessages } from '@/common/messages/http-error';
import { DomainListItem } from '@/common/models/domain-list-item';
import { DeleteDomainsBodyDTO } from '@/common/models/dto/domain/delete-domains.body.dto';
import { GetAllDomainsQueryDTO } from '@/common/models/dto/domain/get-all-domains.query.dto';
import { GetDomainParamDTO } from '@/common/models/dto/domain/get-domain.param.dto';
import { GetRecordsParamDTO } from '@/common/models/dto/domain/get-records.param.dto';
import { RegisterDomainBodyDTO } from '@/common/models/dto/domain/register-domain.body.dto';
import { UpdateRecordBodyDTO } from '@/common/models/dto/domain/update-record.body.dto';
import { UpdateRecordParamDTO } from '@/common/models/dto/domain/update-record.param.dto';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '../decorators/current-user';
import { DomainService } from './domain.service';
import { RecordService } from './record.service';

@Controller('/api/domain')
export class DomainController {
  public constructor(
    private readonly domainService: DomainService,
    private readonly recordService: RecordService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async getAllDomains(
    @CurrentUser() user: UserEntity,
    @Query() { domain }: GetAllDomainsQueryDTO,
  ): Promise<ResponseDTO<DomainListItem[] | DomainEntity>> {
    if (typeof domain !== 'undefined') {
      const storedDomain = await this.domainService.getDomainByName(domain);

      if (!storedDomain)
        throw new NotFoundException(HttpErrorMessages.DMC_DOMAIN_NOT_FOUND);
      if (storedDomain.ownerId !== user.id)
        throw new ForbiddenException(
          HttpErrorMessages.DMC_DOMAIN_BELONGS_TO_OTHER_USER,
        );

      return new ResponseDTO(HttpStatus.OK, [], storedDomain);
    }

    const domains = await this.domainService.getAllDomainsByUserId(user.id);

    const result: DomainListItem[] = [];

    for (const domain of domains) {
      result.push({
        id: domain.id,
        domain: domain.domain,
        creationDate: domain.creationDate.getTime(),
        records: await this.recordService.getRecordsCountByDomainId(domain.id),
      });
    }

    return new ResponseDTO(HttpStatus.OK, [], result);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':domainId')
  public async getDomain(
    @CurrentUser() user: UserEntity,
    @Param() { domainId }: GetDomainParamDTO,
  ): Promise<ResponseDTO<DomainEntity>> {
    const storedDomain = await this.domainService.getDomainById(domainId);

    if (!storedDomain)
      throw new NotFoundException(HttpErrorMessages.DMC_DOMAIN_NOT_FOUND);
    if (storedDomain.ownerId !== user.id)
      throw new ForbiddenException(
        HttpErrorMessages.DMC_DOMAIN_BELONGS_TO_OTHER_USER,
      );

    return new ResponseDTO(HttpStatus.OK, [], storedDomain);
  }

  @Get(':domainId/record')
  public async getRecords(
    @CurrentUser() user: UserEntity,
    @Param() { domainId }: GetRecordsParamDTO,
  ): Promise<ResponseDTO<RecordEntity[]>> {
    const storedDomain = await this.domainService.getDomainById(domainId);

    if (!storedDomain)
      throw new NotFoundException(HttpErrorMessages.DMC_DOMAIN_NOT_FOUND);

    if (storedDomain.ownerId !== user.id)
      throw new ForbiddenException(
        HttpErrorMessages.DMC_DOMAIN_BELONGS_TO_OTHER_USER,
      );

    const records = await this.recordService.getRecordsByDomainId(domainId);

    return new ResponseDTO(HttpStatus.OK, [], records);
  }

  @Put(':domainId/record/:recordId')
  public async updateRecord(
    @CurrentUser() user: UserEntity,
    @Param() { domainId, recordId }: UpdateRecordParamDTO,
    @Body() record: UpdateRecordBodyDTO,
  ): Promise<ResponseDTO<RecordEntity>> {
    const storedDomain = await this.domainService.getDomainById(domainId);

    if (!storedDomain)
      throw new NotFoundException(HttpErrorMessages.DMC_DOMAIN_NOT_FOUND);

    if (storedDomain.ownerId !== user.id)
      throw new ForbiddenException(
        HttpErrorMessages.DMC_DOMAIN_BELONGS_TO_OTHER_USER,
      );

    const storedRecord = await this.recordService.getRecordById(recordId);

    if (!storedRecord)
      throw new NotFoundException(HttpErrorMessages.DMC_RECORD_NOT_FOUND);

    if (storedRecord.domainId !== domainId)
      throw new BadRequestException(
        HttpErrorMessages.DMC_RECORD_BELONGS_TO_OTHER_DOMAIN,
      );

    const updatedRecord = await this.recordService.updateRecord(
      storedRecord,
      record,
    );

    return new ResponseDTO(HttpStatus.OK, [], updatedRecord);
  }

  @Post()
  public async registerDomain(
    @CurrentUser() user: UserEntity,
    @Body() { domain }: RegisterDomainBodyDTO,
  ): Promise<ResponseDTO<void>> {
    const storedDomain = await this.domainService.getDomainByName(domain);

    if (storedDomain)
      throw new ForbiddenException(HttpErrorMessages.DMC_DOMAIN_ALREADY_EXISTS);

    await this.domainService.registerDomain(user.id, domain);

    return new ResponseDTO(HttpStatus.OK, []);
  }

  @Delete()
  public async deleteDomains(
    @CurrentUser() user: UserEntity,
    @Body() { ids }: DeleteDomainsBodyDTO,
  ): Promise<ResponseDTO<void>> {
    const domains = await this.domainService.getDomainsByIds(ids);

    for (const domain of domains) {
      if (domain.ownerId !== user.id)
        throw new ForbiddenException(
          HttpErrorMessages.DMC_DOMAIN_BELONGS_TO_OTHER_USER,
        );
    }

    await this.domainService.deleteDomains(ids);

    return new ResponseDTO(HttpStatus.OK, []);
  }
}

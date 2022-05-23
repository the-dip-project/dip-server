import { CurrentUser } from '@/common/decorators/current-user';
import { DomainEntity, RecordEntity, UserEntity } from '@/common/entities';
import { HttpErrorMessages } from '@/common/messages/http-error';
import { DomainListItem } from '@/common/models/domain-list-item';
import { GetAllDomainsQueryDTO } from '@/common/models/dto/domain/get-all-domains.query.dto';
import { GetDomainParamDTO } from '@/common/models/dto/domain/get-domain.param.dto';
import { GetRecordsParamDTO } from '@/common/models/dto/domain/get-records.param.dto';
import { RegisterDomainBodyDTO } from '@/common/models/dto/domain/register-domain.body.dto';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

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
}

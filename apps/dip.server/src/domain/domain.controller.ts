import { CurrentUser } from '@/common/decorators/current-user';
import { DomainEntity, UserEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { GetAllDomainsQueryDTO } from '@/common/models/dto/domain/get-all-domains.query.dto';
import { GetDomainParamDTO } from '@/common/models/dto/domain/get-domain.param.dto';
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

@Controller('/api/domain')
export class DomainController {
  public constructor(private readonly domainService: DomainService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async getAllDomains(
    @CurrentUser() user: UserEntity,
    @Query() { domain }: GetAllDomainsQueryDTO,
  ): Promise<ResponseDTO<DomainListItem[] | DomainEntity>> {
    if (typeof domain !== 'undefined') {
      const storedDomain = await this.domainService.getDomainByName(domain);

      if (!storedDomain) throw new NotFoundException('domain does not exist');
      if (storedDomain.ownerId !== user.id)
        throw new ForbiddenException('domain belongs to other user');

      return new ResponseDTO(HttpStatus.OK, [], storedDomain);
    }

    const domains = await this.domainService.getAllDomainsByUserId(user.id);

    const result: DomainListItem[] = [];

    for (const domain of domains) {
      result.push({
        id: domain.id,
        domain: domain.domain,
        creationDate: domain.creationDate.getTime(),
        records: await this.domainService.getRecordsCountByDomainId(domain.id),
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

    if (!storedDomain) throw new NotFoundException('domain does not exist');
    if (storedDomain.ownerId !== user.id)
      throw new ForbiddenException('domain belongs to other user');

    return new ResponseDTO(HttpStatus.OK, [], storedDomain);
  }

  @Post()
  public async registerDomain(
    @CurrentUser() user: UserEntity,
    @Body() { domain }: RegisterDomainBodyDTO,
  ): Promise<ResponseDTO<void>> {
    const storedDomain = await this.domainService.getDomainByName(domain);

    if (storedDomain) throw new ForbiddenException('domain already exists');

    await this.domainService.registerDomain(user.id, domain);

    return new ResponseDTO(HttpStatus.OK, []);
  }
}

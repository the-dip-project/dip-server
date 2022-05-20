import { CurrentUser } from '@/common/decorators/current-user';
import { DomainEntity, UserEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { GetDomainParamDTO } from '@/common/models/dto/domain/get-domain.param.dto';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { DomainService } from './domain.service';

@Controller('/api/domain')
export class DomainController {
  public constructor(private readonly domainService: DomainService) {}

  @Get()
  public async getAllDomains(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDTO<DomainListItem[]>> {
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

  @Get(':domain')
  public async getDomain(
    @CurrentUser() user: UserEntity,
    @Param() { domain }: GetDomainParamDTO,
  ): Promise<ResponseDTO<DomainEntity>> {
    const storedDomain = await this.domainService.getDomainByName(domain);

    if (!storedDomain) throw new NotFoundException('domain does not exist');
    if (storedDomain.ownerId !== user.id)
      throw new ForbiddenException('domain belongs to another user');

    return new ResponseDTO(HttpStatus.OK, [], storedDomain);
  }
}

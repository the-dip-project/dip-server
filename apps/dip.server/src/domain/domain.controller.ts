import { CurrentUser } from '@/common/decorators/current-user';
import { UserEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { Controller, Get, HttpStatus } from '@nestjs/common';
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
}

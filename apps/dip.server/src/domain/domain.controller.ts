import { CurrentUser } from '@/common/decorators/current-user';
import { UserEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('/api/domain')
export class DomainController {
  @Get()
  public async getAllDomains(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDTO<DomainListItem[]>> {
    return new ResponseDTO(HttpStatus.OK, [], null);
  }
}

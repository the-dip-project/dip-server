import { IsNumber, Min } from 'class-validator';

import { GetDomainParamDTO } from './get-domain.param.dto';

export class UpdateRecordParamDTO extends GetDomainParamDTO {
  @Min(1, {
    message: 'recordId must be greater than 0',
  })
  @IsNumber()
  recordId!: number;
}

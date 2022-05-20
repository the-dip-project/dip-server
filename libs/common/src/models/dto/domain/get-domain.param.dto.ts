import { IsNumber, Min } from 'class-validator';

export class GetDomainParamDTO {
  @Min(1, {
    message: 'domainId must be greater than 0',
  })
  @IsNumber()
  domainId!: number;
}

import { IsFQDN, IsString } from 'class-validator';

export class GetDomainParamDTO {
  @IsFQDN()
  @IsString()
  domain!: string;
}

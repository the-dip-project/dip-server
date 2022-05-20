import { IsFQDN, IsOptional, IsString } from 'class-validator';

export class GetAllDomainsQueryDTO {
  @IsFQDN()
  @IsString()
  @IsOptional()
  domain: string;
}

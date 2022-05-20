import { IsFQDN, IsString } from 'class-validator';

export class RegisterDomainBodyDTO {
  @IsFQDN()
  @IsString()
  domain!: string;
}

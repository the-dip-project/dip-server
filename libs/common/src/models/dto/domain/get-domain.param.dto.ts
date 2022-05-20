import { IsString, Length } from 'class-validator';

export class GetDomainParamDTO {
  @Length(4, 253)
  @IsString()
  domain!: string;
}

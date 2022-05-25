import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

import { CLASS, TYPE } from '@/common/constants/dns-spec';

export class UpdateRecordBodyDTO {
  @Matches(/^(@|([a-z0-9](-[a-z0-9])?)+)$/i)
  @IsString()
  @IsOptional()
  host?: string;

  @Min(1, {
    message: 'ttl must be greater than 0',
  })
  @IsInt()
  @IsNumber()
  @IsOptional()
  ttl?: number;

  @IsIn(Object.values(TYPE))
  @IsInt()
  @IsNumber()
  @IsOptional()
  type?: number;

  @IsIn(Object.values(CLASS))
  @IsInt()
  @IsNumber()
  @IsOptional()
  class?: number;

  @IsString()
  @IsOptional()
  data?: string;

  @IsString()
  @IsOptional()
  extendedData?: string;
}

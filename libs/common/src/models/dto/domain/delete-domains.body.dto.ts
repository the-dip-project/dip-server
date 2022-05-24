import { IsArray, IsNumber, Min } from 'class-validator';

export class DeleteDomainsBodyDTO {
  @Min(1, { each: true })
  @IsNumber({}, { each: true })
  @IsArray()
  ids: number[];
}

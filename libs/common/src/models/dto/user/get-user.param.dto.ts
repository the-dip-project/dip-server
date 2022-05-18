import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserParamDTO {
  @IsNotEmpty()
  @IsString()
  userId!: string;
}

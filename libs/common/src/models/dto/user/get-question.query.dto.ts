import { IsString, Length } from 'class-validator';

export class GetQuestionQueryDTO {
  @Length(1, 32)
  @IsString()
  username!: string;
}

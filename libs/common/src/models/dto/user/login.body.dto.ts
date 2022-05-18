import { IsString, Length } from 'class-validator';

export class LoginBodyDTO {
  @Length(64, 64, {
    message: 'Answer must be equal to 64 characters',
  })
  @IsString()
  answer!: string;
}

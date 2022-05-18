import { Response } from 'express';

import { CookieEntries } from '@/common/constants/cookie-entries';
import { Environments } from '@/common/constants/environments';
import { Cookies } from '@/common/decorators/cookies';
import { byHours } from '@/common/helpers/timespan';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { GetQuestionQueryDTO } from '@/common/models/dto/user/get-question.query.dto';
import { LoginBodyDTO } from '@/common/models/dto/user/login.body.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../base/config.module';
import { AnswerValidationErrors, UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  public constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/login')
  public async getQuestion(
    @Cookies(CookieEntries.REQUEST_ID) rid: string,
    @Query() { username }: GetQuestionQueryDTO,
  ): Promise<ResponseDTO<string>> {
    const user = await this.userService.getUserByUsername(username);

    if (!user) throw new NotFoundException('Username not found');

    const { question } = await this.userService.generateChallenge(rid, user);

    return new ResponseDTO(HttpStatus.OK, [], question);
  }

  @Post('/login')
  public async login(
    @Cookies(CookieEntries.REQUEST_ID) rid: string,
    @Res({ passthrough: true }) res: Response,
    @Body() { answer }: LoginBodyDTO,
  ): Promise<ResponseDTO<void>> {
    const validation = await this.userService.validateAnswer(rid, answer);

    if (typeof validation === 'string') {
      res.cookie(CookieEntries.AUTH_TOKEN, validation, {
        httpOnly: true,
        signed:
          this.configService.get<Environments>(ConfigKeys.ENVIRONMENT) ===
          Environments.PRODUCTION,
        expires: new Date(Date.now() + byHours(5)),
        sameSite: 'strict',
      });

      return new ResponseDTO(HttpStatus.OK, []);
    }

    switch (validation) {
      case AnswerValidationErrors.NOT_FOUND:
        throw new NotFoundException('Challenge not found');

      case AnswerValidationErrors.INVALID:
        throw new NotAcceptableException('Invalid or wrong answer');
    }
  }
}

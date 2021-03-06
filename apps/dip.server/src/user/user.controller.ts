import { Response } from 'express';

import { CookieEntries } from '@/common/constants/cookie-entries';
import { Environments } from '@/common/constants/environments';
import { UserEntity } from '@/common/entities';
import { HttpErrorMessages } from '@/common/messages/http-error';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { GetQuestionQueryDTO } from '@/common/models/dto/user/get-question.query.dto';
import { GetUserParamDTO } from '@/common/models/dto/user/get-user.param.dto';
import { LoginBodyDTO } from '@/common/models/dto/user/login.body.dto';
import { PublicUser } from '@/common/models/public-user';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../base/config.module';
import { Cookies } from '../decorators/cookies';
import { CurrentUser } from '../decorators/current-user';
import { AnswerValidationErrors, UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  public constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/login')
  public async getQuestion(
    @Res({ passthrough: true }) res: Response,
    @Query() { username }: GetQuestionQueryDTO,
  ): Promise<ResponseDTO<string>> {
    const user = await this.userService.getUserByUsername(username);

    if (!user)
      throw new NotFoundException(HttpErrorMessages.USC_USERNAME_NOT_FOUND);

    const { question, questionCheck, questionCheckBody } =
      await this.userService.generateChallenge(user);

    res.cookie(CookieEntries.QUESTION_CHECK, questionCheck, {
      httpOnly: true,
      signed:
        this.configService.get<Environments>(ConfigKeys.ENVIRONMENT) ===
        Environments.PRODUCTION,
      expires: new Date(questionCheckBody.exp),
      sameSite: 'strict',
    });

    return new ResponseDTO(HttpStatus.OK, [], question);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Cookies(CookieEntries.QUESTION_CHECK) questionCheck: string,
    @Body() { answer, escalate }: LoginBodyDTO,
  ): Promise<ResponseDTO<void>> {
    if (!questionCheck)
      throw new BadRequestException(
        HttpErrorMessages.USC_QUESTION_CHECK_MISSING,
      );

    const validation = await this.userService.validateAnswer(
      questionCheck,
      answer,
      !escalate,
    );

    if (typeof validation === 'string') {
      res.cookie(
        escalate
          ? CookieEntries.ESCALATED_AUTH_TOKEN
          : CookieEntries.AUTH_TOKEN,
        validation,
        {
          httpOnly: true,
          signed:
            this.configService.get<Environments>(ConfigKeys.ENVIRONMENT) ===
            Environments.PRODUCTION,
          expires: new Date(
            Date.now() +
              (escalate
                ? this.configService.get<number>(
                    ConfigKeys.ESCALATED_AUTH_TOKEN_EXP,
                  )
                : this.configService.get<number>(ConfigKeys.AUTH_TOKEN_EXP)),
          ),
          sameSite: 'strict',
        },
      );

      res.clearCookie(CookieEntries.QUESTION_CHECK);

      return new ResponseDTO(HttpStatus.OK, []);
    }

    switch (validation) {
      case AnswerValidationErrors.NOT_DECODABLE:
        throw new BadRequestException(
          HttpErrorMessages.USC_QUESTION_CHECK_CAN_NOT_BE_DECODED,
        );

      case AnswerValidationErrors.NOT_VERIFIABLE:
        throw new BadRequestException(
          HttpErrorMessages.USC_QUESTION_CHECK_WRONG_SIGNATURE,
        );

      case AnswerValidationErrors.USER_NOT_FOUND:
        throw new NotFoundException(HttpErrorMessages.USC_USER_NOT_FOUND);

      case AnswerValidationErrors.EXPIRED:
        throw new BadRequestException(
          HttpErrorMessages.USC_QUESTION_CHECK_EXPIRED,
        );

      case AnswerValidationErrors.WRONG:
        throw new BadRequestException(
          HttpErrorMessages.USC_ANSWER_IS_INCORRECT,
        );

      default:
        throw new NotImplementedException(HttpErrorMessages.$_UNKNOWN_ERROR);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  public logout(@Res({ passthrough: true }) res: Response): ResponseDTO<void> {
    res.clearCookie(CookieEntries.AUTH_TOKEN);

    return new ResponseDTO(HttpStatus.OK, []);
  }

  @Get('/:userId')
  public async getUser(
    @Param() { userId: _userId }: GetUserParamDTO,
    @CurrentUser({ escalation: true })
    user: UserEntity & { escalatedUntil: number },
  ): Promise<ResponseDTO<PublicUser>> {
    if (!user)
      throw new UnauthorizedException(HttpErrorMessages.USC_AUTH_REQUIRED);

    if (_userId === 'me')
      return new ResponseDTO(
        HttpStatus.OK,
        [],
        this.userService.reduceUser(user),
      );

    if (_userId.match(/\D/))
      throw new BadRequestException(HttpErrorMessages.USC_BAD_UID);

    const userId = parseInt(_userId, 10);
    const result = this.userService.reduceUser(
      await this.userService.getUserById(userId),
    );

    result.escalatedUntil = user.escalatedUntil;

    return new ResponseDTO(HttpStatus.OK, [], result);
  }

  @Post('/me/secret')
  public async generateNewSecret(
    @CurrentUser({ escalation: true })
    user: UserEntity & { escalatedUntil?: number },
  ): Promise<ResponseDTO<void>> {
    if (!user.escalatedUntil || user.escalatedUntil < Date.now())
      throw new ForbiddenException(HttpErrorMessages.USC_ESCALATION_REQUIRED);

    await this.userService.generateNewSecret(user.id);

    return new ResponseDTO(HttpStatus.CREATED, []);
  }
}

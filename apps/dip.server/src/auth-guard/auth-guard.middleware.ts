import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { CookieEntries } from '@/common/constants/cookie-entries';
import { Environments } from '@/common/constants/environments';
import { UserEntity } from '@/common/entities';
import { decode, verify } from '@/common/helpers/jwt';
import { HttpErrorMessages } from '@/common/messages/http-error';
import { AuthTokenPayload } from '@/common/models/auth-token-payload';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfigKeys } from '../base/config.module';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isProd =
      this.configService.get<Environments>(ConfigKeys.ENVIRONMENT) ===
      Environments.PRODUCTION;

    const token =
      req[isProd ? 'signedCookies' : 'cookies'][CookieEntries.AUTH_TOKEN];

    if (typeof token !== 'string')
      throw new BadRequestException(HttpErrorMessages.AGM_AUTH_TOKEN_NOT_FOUND);

    let id: number;

    try {
      const { userId, level } = (await decode<AuthTokenPayload>(
        token,
      )) as AuthTokenPayload;
      id = userId;

      if (typeof userId !== 'number' && typeof level !== 'number') {
        res.clearCookie(CookieEntries.AUTH_TOKEN);
        throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
      }
    } catch (err) {
      throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.clearCookie(CookieEntries.AUTH_TOKEN);
      throw new NotFoundException(HttpErrorMessages.AGM_CARRIED_USER_NOT_FOUND);
    }

    try {
      await verify(token, user.secret);
    } catch (err) {
      res.clearCookie(CookieEntries.AUTH_TOKEN);
      throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
    }

    req.user = user;
    next();
  }
}

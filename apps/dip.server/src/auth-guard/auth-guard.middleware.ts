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
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  private readonly isProd: boolean;
  private readonly authTokenExpiration: number;

  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.isProd =
      this.configService.get<Environments>(ConfigKeys.ENVIRONMENT) ===
      Environments.PRODUCTION;
    this.authTokenExpiration = this.configService.get<number>(
      ConfigKeys.AUTH_TOKEN_EXP,
    );
  }

  private async verifyToken(
    entry: CookieEntries,
    token: string,
    res: Response,
  ): Promise<UserEntity> {
    if (typeof token !== 'string')
      throw new BadRequestException(HttpErrorMessages.AGM_AUTH_TOKEN_NOT_FOUND);

    let id: number;

    try {
      const { userId, level } = (await decode<AuthTokenPayload>(
        token,
      )) as AuthTokenPayload;
      id = userId;

      if (typeof userId !== 'number' && typeof level !== 'number') {
        res.clearCookie(entry);
        throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
      }
    } catch (err) {
      throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.clearCookie(entry);
      throw new NotFoundException(HttpErrorMessages.AGM_CARRIED_USER_NOT_FOUND);
    }

    try {
      await verify(token, user.secret);
    } catch (err) {
      res.clearCookie(entry);
      throw new BadRequestException(HttpErrorMessages.AGM_INVALID_TOKEN);
    }

    if (entry === CookieEntries.AUTH_TOKEN) {
      res.cookie(entry, await this.userService.generateToken(false, user), {
        httpOnly: true,
        signed: this.isProd,
        expires: new Date(Date.now() + this.authTokenExpiration),
        sameSite: 'strict',
      });
    }

    return user;
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        req[this.isProd ? 'signedCookies' : 'cookies'][
          CookieEntries.ESCALATED_AUTH_TOKEN
        ];

      const user = await this.verifyToken(
        CookieEntries.ESCALATED_AUTH_TOKEN,
        token,
        res,
      );

      req.user = user;
      return next();
    } catch (err) {}

    const token =
      req[this.isProd ? 'signedCookies' : 'cookies'][CookieEntries.AUTH_TOKEN];

    const user = await this.verifyToken(CookieEntries.AUTH_TOKEN, token, res);

    req.user = user;
    next();
  }
}

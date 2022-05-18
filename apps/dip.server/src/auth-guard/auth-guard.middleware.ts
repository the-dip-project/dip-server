import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { CookieEntries } from '@/common/constants/cookie-entries';
import { Environments } from '@/common/constants/environments';
import { UserEntity } from '@/common/entities';
import { decode, verify } from '@/common/helpers/jwt';
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
      throw new BadRequestException('required auth token not found');

    const { userId, level } = (await decode<AuthTokenPayload>(
      token,
    )) as AuthTokenPayload;

    if (typeof userId !== 'number' && typeof level !== 'number') {
      res.clearCookie(CookieEntries.AUTH_TOKEN);
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      res.clearCookie(CookieEntries.AUTH_TOKEN);
      throw new NotFoundException("User in token's payload not found");
    }

    try {
      await verify(token, user.secret);
    } catch (err) {
      res.clearCookie(CookieEntries.AUTH_TOKEN);
      throw new BadRequestException('Invalid token');
    }

    req.user = user;
    next();
  }
}

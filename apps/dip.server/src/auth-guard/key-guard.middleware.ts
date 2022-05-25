import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class KeyGuardMiddleware implements NestMiddleware {
  public constructor(private readonly userService: UserService) {}

  public async use(req: Request, _res: Response, next: NextFunction) {
    const { api_key: key } = req.query;

    if (!key || typeof key !== 'string') return next();

    const user = await this.userService.getUserByApiKey(key as string);

    req.user = user;

    next();
  }
}

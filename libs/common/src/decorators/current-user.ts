import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!('user' in request)) return undefined;

    return property ? request.user[property] : request.user;
  },
);

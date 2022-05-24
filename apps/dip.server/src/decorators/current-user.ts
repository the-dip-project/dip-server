import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface IProps {
  escalation: boolean;
}

export const CurrentUser = createParamDecorator(
  ({ escalation }: IProps = { escalation: false }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!escalation) return request.user;
    else return { ...request.user, escalatedUntil: request?.escalatedUntil };
  },
);

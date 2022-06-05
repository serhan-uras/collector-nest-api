import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { AUTHORIZED_USER_DATA } from 'src/middlewares/authorization.middleware';

import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    const authorizedUserData = req[AUTHORIZED_USER_DATA];

    if (!authorizedUserData) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return authorizedUserData;
  },
);

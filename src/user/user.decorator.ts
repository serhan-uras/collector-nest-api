import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')
      : null;

    console.log('token', { token });

    return {
      id: 'c1f1fb38-e454-11ec-8fea-0242ac120002',
      name: 'serhan uras',
      roles: ['researcher'],
    };
  },
);

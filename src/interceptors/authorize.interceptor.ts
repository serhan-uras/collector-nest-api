import {
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/auth/rote.entity';
import { User } from 'src/auth/user.entity';
import { AUTHORIZED_USER_DATA } from 'src/middlewares/authorization.middleware';

export function Authorize(roles?: Role[]) {
  return UseInterceptors(new AuthorizeInterceptor(roles ?? []));
}

@Injectable()
export class AuthorizeInterceptor implements NestInterceptor {
  constructor(private roles: Role[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const authorizedUserData: User = req[AUTHORIZED_USER_DATA];

    if (!authorizedUserData) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    let isAuthorized = false;

    if (this.roles.length === 0) {
      isAuthorized = true;
    } else {
      authorizedUserData.roles.forEach((role) => {
        if (this.roles.includes(role as Role)) {
          isAuthorized = true;
        }
      });
    }

    if (!isAuthorized) {
      throw new HttpException('UnAuthorized', HttpStatus.UNAUTHORIZED);
    }

    return next.handle();
  }
}

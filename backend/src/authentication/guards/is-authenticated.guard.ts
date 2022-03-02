import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IsAuth implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.user;
  }
}
